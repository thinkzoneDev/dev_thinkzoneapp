import { Component, NgZone, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import {
  AlertController,
  ToastController,
  LoadingController,
} from "@ionic/angular";
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { RestApiService } from "../../rest-api.service";

import { Storage } from "@ionic/storage";

@Component({
  selector: "app-managerfolderview",
  templateUrl: "./managerfolderview.page.html",
  styleUrls: ["./managerfolderview.page.scss"],
})
export class ManagerfolderviewPage implements OnInit {
  respons: any;
  main_arr: any = [];
  userid: any;

  fileTransferObj: FileTransferObject;
  fileextension: string = "";
  dlprogress: string = "";

  links = [];
  storedFiles = [];
  toolbarshadow = true;
  filelist: any = [];
  folderlist: any = [];

  foldername: string = "";

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    public loadingController: LoadingController,
    public fileTransfer: FileTransfer,
    public file: File,
    public _zone: NgZone,
    public fileOpener: FileOpener,
    public storage: Storage
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.foldername =
          this.router.getCurrentNavigation().extras.state.folderobj;
        this.getfilelist();
      }
    });

    this.userid = localStorage.getItem("_userid");
  }

  ngOnInit() {}

  // ----------- new code --------------
  async getfilelist() {
    await this.api
      .getallfilelistinsidedirectorybyapptype("teacherapp", this.foldername)
      .subscribe(
        (res) => {
          let value: any = [];
          if (res.length <= 0) {
            this.filelist = [];
            this.links = [];
          } else {
            res.forEach((obj) => {
              if (obj.type == "file") value.push(obj);
            });
            this.filelist = value;
            this.links = value;
            this.storage.get("storedFiles").then((value) => {
              if (value && value.length > 0) {
                this.storedFiles = value;
              } else {
                this.storedFiles = [];
              }
              this.applyIcons();
            });
          }
        },
        (err) => {}
      );
  }
  // -----------------------------------

  async getManagerBoxData() {
    await this.api.getAllFromManagersBox().subscribe(
      (res) => {
        this.links = res;
        this.storage.get("storedFiles").then((value) => {
          if (value && value.length > 0) {
            this.storedFiles = value;
          } else {
            this.storedFiles = [];
          }
          this.applyIcons();
        });
      },
      (err) => {}
    );
  }

  applyIcons() {
    for (var l = 0; l < (this.links || []).length; l++) {
      const http_url = this.links[l];
      const stored = this.storedFiles.find(
        (f) => f.Hyper_URL == http_url.s3path
      );
      if (stored) {
        this.links[l].stored = true;
        this.links[l].stored_url = stored.Native_URL;
      } else {
        this.links[l].stored = false;
      }
    }
  }

  // ===================== File Check in Local & Download Process Starts Here =====================
  file_icon_click(selectedfile) {
    console.log("--> selectedfile: " + JSON.stringify(selectedfile));

    let filepath =
      this.file.externalDataDirectory +
      "/resources/" +
      selectedfile.displayname;
    let url = encodeURI(selectedfile.s3path);
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
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    return MIMETypes[ext];
  }
  // ===================== File Check in Local & Download Process End Here =====================
}
