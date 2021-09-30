import { Component, NgZone, ViewChild } from "@angular/core";
import {
  NavController,
  AlertController,
  ToastController,
  LoadingController,
} from "@ionic/angular";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";
import { Storage } from "@ionic/storage";
import { RestApiService } from "./../../rest-api.service";
import { IonContent } from "@ionic/angular";

@Component({
  selector: "app-pgeactivitycontents",
  templateUrl: "./pgeactivitycontents.page.html",
  styleUrls: ["./pgeactivitycontents.page.scss"],
})
export class PgeactivitycontentsPage {
  // default variables
  preferedlanguage: string = "";
  userid: string = "";
  program: string = "";
  subject: string = "";
  level: string = "";
  month: string = "";
  skill: string = "";
  week: string = "";

  skilldetails_list: any = [];
  segments_list: any = [];
  contentstatus: boolean = false;
  activity_already_submitted: boolean = false;

  // show-hide next prev buttons of the slide
  hide_prev_button: boolean = false;
  hide_next_button: boolean = false;

  // file
  fileTransferObj: FileTransferObject;
  fileextension: string = "";

  dlprogress: string = "";

  //details of no. of only video files in that segment. It will required at time of completing activity, whether the video file is downloaded or not.
  video_file_list: any = [];
  all_videos_downloaded: boolean = false;

  @ViewChild(IonContent) content: IonContent;

  myContent: IonContent;
  constructor(
    public navController: NavController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private file: File,
    private fileOpener: FileOpener,
    private fileTransfer: FileTransfer,
    private storage: Storage,
    private _zone: NgZone,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params.parameters == undefined || params.parameters.length == 0) {
        this.contentstatus = true;
      } else {
        this.contentstatus = false;
      }
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
          "--> preferedlanguage: " +
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
        this.getactivitycontentsbyskill(
          this.preferedlanguage,
          this.program,
          this.subject,
          this.level,
          this.skill
        );
      }
    });
  }

  ngOnInit(): void {
    this.gettchactivitiynewdetails();
    // this.swipeLoad();
  }

  // get activitiy details
  async gettchactivitiynewdetails() {
    console.log(
      "check ---->>>>",
      this.preferedlanguage,
      this.userid,
      this.program,
      this.subject,
      this.month,
      this.skill,
      this.level
    );

    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api
      .tchactivitynew_getactivitiydetails(
        this.preferedlanguage,
        this.userid,
        this.program,
        this.subject,
        this.month,
        this.skill,
        this.level
      )
      .subscribe(
        (res) => {
          // console.log(
          //   "-->tchactivitynew_getactivitiydetails: " + JSON.stringify(res)
          // );
          console.log("activity --->>>", res);

          if (res.length > 0) {
            this.activity_already_submitted = true;
          } else {
            this.activity_already_submitted = false;
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
        }
      );
  }

  current_segment: any = 0;

  next(ind) {
    // console.log("ind-->", ind, "   total-->", this.segments_list.length);

    if (ind < this.segments_list.length - 1) {
      this.current_segment = ind + 1;
    } else if (ind == this.segments_list.length - 1) {
      this.hide_next_button = true;
      this.content.scrollToBottom(1500);
    }
  }

  prev(ind) {
    if (ind > 0) this.current_segment = ind - 1;
    if (ind != this.segments_list.length - 2) {
      this.hide_next_button = false;
    }
  }

  // swipeLoad() {
  //   this.slides.getActiveIndex().then((index) => {
  //     console.log("-->Current index: " + index);
  //   });
  //   this.slides.isBeginning().then((value) => {
  //     console.log("-->isBeginning: " + value);
  //     this.hide_prev_button = value ? true : false;
  //   });
  //   this.slides.isEnd().then((value) => {
  //     console.log("-->isEnd: " + value);
  //     this.hide_next_button = value ? true : false;
  //   });
  // }

  // swipeNext() {
  //   this.slides.slideNext();

  //   // Info about the current card and show/hide next/prev button
  //   this.slides.getActiveIndex().then((index) => {
  //     console.log("-->Current index: " + index);
  //   });
  //   this.slides.isBeginning().then((value) => {
  //     console.log("-->isBeginning: " + value);
  //     this.hide_prev_button = value ? true : false;
  //   });
  //   this.slides.isEnd().then((value) => {
  //     console.log("-->isEnd: " + value);
  //     this.hide_next_button = value ? true : false;
  //   });
  // }

  // swipePrev() {
  //   this.slides.slidePrev();

  //   // Info about the current card and show/hide next/prev button
  //   this.slides.getActiveIndex().then((index) => {
  //     console.log("-->Current index: " + index);
  //   });
  //   this.slides.isBeginning().then((value) => {
  //     console.log("-->isBeginning: " + value);
  //     this.hide_prev_button = value ? true : false;
  //   });
  //   this.slides.isEnd().then((value) => {
  //     console.log("-->isEnd: " + value);
  //     this.hide_next_button = value ? true : false;
  //   });
  // }

  async getactivitycontentsbyskill(
    preferedlanguage,
    program,
    subject,
    level,
    skill
  ) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api
      .getmasterpgeactivitiydetails(
        preferedlanguage,
        program,
        subject,
        level,
        skill
      )
      .subscribe(
        (res) => {
          // console.log(
          //   "--> pge activity fetch data res: " + JSON.stringify(res)
          // );
          if (res.length > 0) {
            this.contentstatus = true;
            this.skilldetails_list = res;
            this.segments_list = res[0]["segment"];
            // console.log(
            //   "--> segments_list: " + JSON.stringify(this.segments_list)
            // );
            this.get_video_file_list(this.segments_list);
          } else {
            this.contentstatus = false;
            this.skilldetails_list = [];
            this.segments_list = [];
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
        }
      );
  }
  scrollToBottomOnInit() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom(400);
      }
    }, 500);
  }
  get_video_file_list(segment_list) {
    this.video_file_list = [];
    if (segment_list.length > 0) {
      segment_list.forEach((element) => {
        if (element.type == "video_content") {
          this.video_file_list.push(element);
        }
      });
    } else {
      this.video_file_list = [];
    }
    // console.log("--> video_file_list: " + JSON.stringify(this.video_file_list));
  }

  video_card_on_click(segment) {
    // console.log("--> clicked segment: " + JSON.stringify(segment));
  }
  /*
  download_btn_click(segment){
    let filepath = this.file.externalDataDirectory+'/resources/'+segment.displayname;
    let url = encodeURI(segment.s3_url);
    console.log('--> filepath: '+filepath+'    url: '+url);
    this.download_file(url, filepath);
  }
  */

  // ===================== File Check in Local & Download Process Starts Here =====================
  play_btn_click(segment) {
    let filepath =
      this.file.externalDataDirectory + "/resources/" + segment.displayname;
    let url = encodeURI(segment.s3_url);
    // console.log("--> filepath: " + filepath + "    url: " + url);

    // check resource folder exists locally or not
    this.file
      .checkDir(this.file.externalDataDirectory, "resources")
      .then((_) => {
        // check the file exists inside it or not
        this.file
          .checkFile(
            this.file.externalDataDirectory,
            "resources" + "/" + segment.displayname
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
        // console.log("--> percentage: " + this.dlprogress);
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
    // console.log("--> filepath: " + filepath);
    this.fileextension = filepath.split(".").pop();
    let filemimetype = this.getMIMEtype(this.fileextension);
    // console.log(
    //   "--> fileextension: " +
    //     this.fileextension +
    //     "    filemimetype: " +
    //     filemimetype
    // );

    this.dlprogress = "";
    this.fileOpener
      .open(filepath, filemimetype)
      .then(() => console.log("File is opened"))
      .catch((e) => {
        alert("File Not Found !!!");
      });
  }

  async delete_btn_click(segment) {
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
            this.delete_file(segment);
          },
        },
      ],
    });
    await alert.present();
  }

  delete_file(segment) {
    this.file
      .removeFile(
        this.file.externalDataDirectory,
        "resources" + "/" + segment.displayname
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
  async check_all_videos_downloaded() {
    const loading = await this.loadingController.create({
      message: "Checking for video files...",
    });
    await loading.present();

    if (this.video_file_list.length > 0) {
      await this.video_file_list.forEach((element) => {
        let videofilename = element.displayname;
        // console.log("-->@@ videofilename: " + videofilename);
        this.file
          .checkFile(
            this.file.externalDataDirectory,
            "resources" + "/" + videofilename
          )
          .then((_) => {
            this.all_videos_downloaded = true;
          })
          .catch((err) => {
            this.all_videos_downloaded = false;
            loading.dismiss();
            return this.file.checkFile;
          });
        loading.dismiss();
      });
    } else {
      loading.dismiss();
      this.all_videos_downloaded = true;
    }
    loading.dismiss();
  }

  async completeActivity() {
    // setTimeout(() => {
    //     this.check_all_videos_downloaded();
    // }, 3000);
    await this.check_all_videos_downloaded();
    console.log("--> Save activity button clicked");
    // console.log(
    //   "-->@@ check_all_videos_downloaded: " + this.all_videos_downloaded
    // );
    if (this.activity_already_submitted) {
      this.showAlert("Info", "", "Activity already completed.");
    } else if (this.all_videos_downloaded == false) {
      this.showAlert(
        "Info",
        "",
        "Activity can not be completed. Because some of the video files are not downloaded yet."
      );
    } else {
      let body = {
        preferedlanguage: this.preferedlanguage,
        userid: this.userid,
        program: this.program,
        subject: this.subject,
        month: this.month,
        week: this.skill,
        // skill: this.skill,
        level: this.level,
        complete: true,
      };
      console.log("check body --->>", body);

      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.tchactivitynew_saveactivity(body).subscribe(
        (res) => {
          console.log(body);
          console.log("act status", res);

          loading.dismiss();
          if (res.status) {
            this.activity_already_submitted = true;
            this.showAlert("Success", "", "Activity completed");
            if (this.program == "pge") {
              if (this.subject == "english") {
                this.router.navigate(["/pgeenglishactivity"]);
              } else if (this.subject == "odia") {
                this.router.navigate(["/pgeodiaactivity"]);
              } else {
                this.router.navigate(["/pgemathactivity"]);
              }
            } else {
              this.router.navigate(["/ecactivity"]);
            }
          } else {
            this.showAlert("Error", "", "There is something wrong");
          }
        },
        (err) => {
          console.log(err);

          loading.dismiss();
        }
      );
    }
  }

  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: "OK",
          handler: () => {
            // console.log("--> Alert OK button clicked");
          },
        },
      ],
    });
    await alert.present();
  }

  // check if the video played fully or not
  videoEnd() {
    // console.log("--> video played fully.");
  }

  go_to_extraresources_page() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify({
          preferedlanguage: this.preferedlanguage,
          userid: this.userid,
          program: this.program,
          subject: this.subject,
          level: this.level,
          month: this.month,
          skill: this.skill,
        }),
      },
    };
    this.router.navigate(["extraresources"], navigationExtras);
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
    } else {
    }
  }
}
