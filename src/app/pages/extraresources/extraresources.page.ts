import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";
import { Storage } from "@ionic/storage";
import {
  NavController,
  AlertController,
  ToastController,
  LoadingController,
} from "@ionic/angular";
import { NgZone } from "@angular/core";

import { RestApiService } from "../../rest-api.service";

@Component({
  selector: "app-extraresources",
  templateUrl: "./extraresources.page.html",
  styleUrls: ["./extraresources.page.scss"],
})
export class ExtraresourcesPage implements OnInit {
  dlprogress: string = "";
  hide_dlprogressdiv: boolean = true;

  // Default variables
  preferedlanguage: string = "";
  userid: string = "";
  program: string = "";
  subject: string = "";
  level: string = "";
  month: string = "";
  skill: string = "";

  // File
  fileTransferObj: FileTransferObject;
  fileextension: string = "";

  // Response
  extraresourcesfile_list: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private api: RestApiService,
    private loadingController: LoadingController,
    private file: File,
    private fileOpener: FileOpener,
    private fileTransfer: FileTransfer,
    private storage: Storage,
    private _zone: NgZone
  ) {
    this.userid = localStorage.getItem("_userid");
    this.route.queryParams.subscribe((params) => {
      if (params && params.paramiters) {
        const qryParams = JSON.parse(params.paramiters);
        console.log("--> qryParams: " + JSON.stringify(qryParams));
        this.preferedlanguage = qryParams.preferedlanguage;
        this.userid = qryParams.userid;
        this.program = qryParams.program;
        this.subject = qryParams.subject;
        this.level = qryParams.level;
        this.month = qryParams.month;
        this.skill = qryParams.skill;
        console.log(
          "-->Extraresources Page: preferedlanguage: " +
            this.preferedlanguage +
            "    userid: " +
            this.userid +
            "    program: " +
            this.program +
            "    subject: " +
            this.subject +
            "    level: " +
            this.level +
            "    month: " +
            this.month +
            "    skill: " +
            this.skill
        );
        this.getextraresourcesdetails(
          this.preferedlanguage,
          this.program,
          this.subject,
          this.skill,
          this.level
        );
      }
    });
  }

  ngOnInit() {}

  async getextraresourcesdetails(
    preferedlanguage,
    program,
    subject,
    skill,
    level
  ) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api
      .getmasterpgeactivitiydetails(
        preferedlanguage,
        program,
        subject,
        skill,
        level
      )
      .subscribe(
        (res) => {
          console.log("--> extraresources res: " + JSON.stringify(res));
          if (res.length > 0) {
            this.extraresourcesfile_list = res[0]["extraresources"];
            console.log(
              "--> extraresourcesfile_list: " +
                JSON.stringify(this.extraresourcesfile_list)
            );
          } else {
            this.extraresourcesfile_list = [];
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
        }
      );
  }

  resourcefile_clicked(resource) {
    let filepath =
      this.file.externalDataDirectory + "/resources/" + resource.displayname;
    let url = encodeURI(resource.s3_url);
    console.log("--> filepath: " + filepath + "    url: " + url);
    this.download_file(url, filepath);
  }

  // ===================== File Check in Local & Download Process Starts Here =====================
  file_icon_click(selectedfile) {
    console.log("--> selectedfile: " + JSON.stringify(selectedfile));

    let filepath =
      this.file.externalDataDirectory +
      "/resources/" +
      selectedfile.displayname;
    let url = encodeURI(selectedfile.s3_url);
    console.log("--> filepath: " + filepath + "    url: " + url);

    // check resource folder exists locally or not
    this.file
      .checkDir(this.file.externalDataDirectory, "resources")
      .then((_) => {
        // check the file exists inside it or not
        this.file
          .checkFile(
            this.file.externalDataDirectory,
            "resources" + "/" + selectedfile.displayname
          )
          .then((_) => {
            this.open_file(filepath);
          })
          .catch((err) => {
            // File Not Found Locally
            this.downloadFileConfirmation(url, filepath);
          });
      })
      .catch((err) => {
        // Folder Not Found Locally
        this.file
          .createDir(this.file.externalDataDirectory, "resources", false)
          .then((response) => {
            this.downloadFileConfirmation(url, filepath);
          })
          .catch((err) => {
            alert(
              "It was not possible to create local directory. Error Message: " +
                JSON.stringify(err)
            );
          });
      });
  }

  async downloadFileConfirmation(url, filepath) {
    const alert = await this.alertController.create({
      header: "Confirmation",
      subHeader: "",
      message:
        "This file will be downloaded into your local storage. Do you want to download it?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Yes",
          handler: () => {
            this.download_file(url, filepath);
          },
        },
      ],
    });
    await alert.present();
  }

  async download_file(_url, filepath) {
    const loading = await this.loadingController.create({
      message: "Downloading ...",
    });
    await loading.present();

    let url = encodeURI(_url);
    this.fileTransferObj = this.fileTransfer.create();

    this.fileTransferObj.onProgress((progressEvent) => {
      this._zone.run(() => {
        var perc = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        this.dlprogress = perc + " %";
        loading.message = this.dlprogress;
        console.log("--> percentage: " + this.dlprogress);
      });
    });

    this.fileTransferObj
      .download(url, filepath)
      .then((entry) => {
        this.dlprogress = "Download complete";
        this.toaster("Download complete", 300);
        this.open_file(filepath);
        loading.dismiss();
      })
      .catch((err) => {
        this.dlprogress = "";
        alert("Error saving file: " + JSON.stringify(err));
        loading.dismiss();
      });
  }

  async open_file(filepath) {
    console.log("--> filepath: " + filepath);
    this.fileextension = filepath.split(".").pop();
    let filemimetype = this.getMIMEtype(this.fileextension);
    console.log(
      "--> fileextension: " +
        this.fileextension +
        "    filemimetype: " +
        filemimetype
    );

    this.dlprogress = "";
    this.fileOpener
      .open(filepath, filemimetype)
      .then(() => console.log("File is opened"))
      .catch((e) => {
        alert("File Not Found !!!");
      });
  }

  async file_icon_delete_click(selectedfile) {
    const alert = await this.alertController.create({
      header: "Confirmation",
      subHeader: "",
      message:
        "This file will be deleted permanently from your local storage. Do you still want to delete it?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Yes",
          handler: () => {
            this.delete_file(selectedfile);
          },
        },
      ],
    });
    await alert.present();
  }

  delete_file(selectedfile) {
    this.file
      .removeFile(
        this.file.externalDataDirectory,
        "resources" + "/" + selectedfile.displayname
      )
      .then((_) => {
        this.toaster("File deleted successfully", 2000);
      })
      .catch((err) => {
        this.toaster("File can not be deleted", 2000);
      });
  }

  async toaster(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
    });
    toast.present();
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      // Audio
      aac: "audio/aac",
      mid: "audio/midi, audio/x-midi",
      midi: "audio/midi, audio/x-midi",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      weba: "audio/webm",
      oga: "audio/ogg",
      opus: "audio/opus",
      // Video
      mp4: "video/mp4",
      avi: "video/x-msvideo",
      mpeg: "video/mpeg",
      webm: "video/webm",
      "3gp": "video/3gpp, audio/3gpp",
      "3g2": "video/3gpp2, audio/3gpp2",
      ogv: "video/ogg",
      // Image
      apng: "image/apng",
      bmp: "image/bmp",
      gif: "image/gif",
      ico: "image/x-icon",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
      svg: "image/svg+xml",
      swf: "application/x-shockwave-flash",
      tif: "image/tiff",
      tiff: "image/tiff",
      webp: "image/webp",
      // Documents
      pdf: "application/pdf",
      txt: "text/plain",
      rtf: "application/rtf",
      csv: "text/csv",
      odt: "application/vnd.oasis.opendocument.text",
      doc: "application/msword",
      docx:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    return MIMETypes[ext];
  }
  // ===================== File Check in Local & Download Process End Here =====================
}
