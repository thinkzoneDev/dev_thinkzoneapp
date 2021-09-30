import { Component, ViewChild, NgZone } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { IonSlides } from "@ionic/angular";

import { RestApiService } from "./../../rest-api.service";
import { ContentdetailsmodalPage } from "./../modal/contentdetailsmodal/contentdetailsmodal.page";
//
// Camera
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
// Geolocation
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
// import { IconpopoverComponent } from '../';
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";
import { Storage } from "@ionic/storage";
import { VideoPlayer, VideoOptions } from "@ionic-native/video-player/ngx";
import { ServerDownService } from "src/app/services/server-down.service";
declare var cordova: any;
@Component({
  selector: "app-contentdetails",
  templateUrl: "./contentdetails.page.html",
  styleUrls: ["./contentdetails.page.scss"],
})
export class ContentDetailsPage {
  @ViewChild("mySlider") slides: IonSlides;
  slideOpts = {
    effect: "cube",
    noSwiping: true,
    initialSlide: 0,
    //speed: 300,
    centeredSlides: true,
    loop: false,
    pager: false,
    slidesPerView: 1,
    autoplay: false,
    spaceBetween: 10,
  };
  fileTransferObj: FileTransferObject;
  fileTransfer: FileTransferObject = this.transfer.create();
  contentdetails: any;
  data: any;
  contentimages: any = [];
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  sliderOptions: any;
  contentvedios: any = [];
  contentdata: any;
  links = [];
  toolbarshadow = true;
  storedFiles = [];
  alldata: any;
  transdata: any;
  contentstatus: boolean = false;
  autoplay: boolean = false;
  language: string;

  is_content_saved: boolean = false;
  is_quiz_saved: boolean = false;

  startTime: any;
  endTime: any;
  year: number = 2021;
  timeSpent = 0;
  timeSpend: any = 0;
  sumOfTimeSpent = 0;
  currentDate: any = null;
  savedDate: any;
  timeSpentData = "";

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private zone: NgZone,
    // private sanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private camera: Camera,
    private geolocation: Geolocation,
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private sanitizer: DomSanitizer,
    private transfer: FileTransfer,
    public file: File,
    // public file: File
    private fileOpener: FileOpener,
    private storage: Storage,
    private videoPlayer: VideoPlayer,
    private serverDownMsg: ServerDownService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this.language = localStorage.getItem("_language");
    this._centerid = "";
    this._centername = "";
    this.route.queryParams.subscribe((params) => {
      if (params.parameters == undefined || params.parameters.length == 0) {
        this.contentstatus = true;
      } else {
        this.contentstatus = false;
        this.alldata = params.parameters[0] ? params.parameters[0] : {};
        this.transdata = params.parameters[0] ? params.parameters[0] : {};
        params.parameters[0].content.forEach(function (value, key) {
          // if(value.type == 'content'){
          //   value.content = value.content.replace( /(<([^>]+)>)/ig, '')
          // }
          if (value.type == "vedio") {
            value.vedioendstatus = false;
          }
        });
        this.contentdata = params.parameters[0].content;
        if (this.contentdata.length == 1) {
          this.hide_next_button = true;
        }
        this.links = this.contentdata;
        this.getTchTraaining_status(
          this._userid,
          this.alldata.moduleid,
          this.alldata.submoduleid,
          this.alldata.topicid
        );
        // this.storage.get('storedFiles').then((value) => {
        //   if(value && value.length > 0 ){
        //     this.storedFiles = value;
        //   }else {
        //     this.storedFiles = [];
        //   }
        //   this.applyIcons();
        // });
      }
    });

    this.startTime = new Date();
    // this.timeSpend = localStorage.getItem("_timeSpent");
    // console.log("constructor", this.timeSpend);
    // this.setTime();
    // this.setDate();
    // console.log("const currentDt", typeof this.currentDate, this.currentDate);
    // this.savedDate = localStorage.getItem("_date");
    // this.saveTimeData();
    // console.log("const savedDt", typeof this.savedDate, this.savedDate);
    // console.log("storage", localStorage);
    // console.log("timeSpendData", this.timeSpentData);
    this.gettimespentdata();
  }

  current_segment: any = 0;

  next(ind) {
    // console.log("ind-->", ind, "   total-->", this.contentdata.length);
    if (ind < this.contentdata.length - 1) {
      this.current_segment = ind + 1;
    } else if (ind == this.contentdata.length - 1) {
      this.endTime = new Date();
      // this.timeDiffCalc(this.appStartTime, this.appEndTime);
      // console.log("spent", typeof this.timeSpent, this.timeSpent);
      // console.log("spend", typeof this.timeSpend, this.timeSpend);
      // this.sumOfTimeSpent = this.timeSpent + parseInt(this.timeSpend);
      // console.log("sum", typeof this.sumOfTimeSpent, this.sumOfTimeSpent);
      // localStorage.setItem("_timeSpent", this.sumOfTimeSpent.toString());
      this.saveTimeData();
      this.goto_submit_modal();
    }
  }

  prev(ind) {
    if (ind > 0) this.current_segment = ind - 1;
  }

  save_operation: boolean = false;
  contentstatus1: boolean = false;

  async getTchTraaining_status(uid, mid, sid, tid) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.gettchtrainingdetails(uid, mid, sid, tid).subscribe(
      (res) => {
        // console.log("123456789", res);
        if (res.length > 0) {
          this.save_operation = false;
          if (res[0].content_status == true) {
            // this.contentstatus = true;
            this.is_content_saved = true;
          } else {
            this.is_content_saved = false;
          }
        } else {
          this.save_operation = true;
          // this.contentstatus = false;
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  ngAfterViewInit() {}

  transform(url) {
    // return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  calltoroot() {
    this.navController.navigateBack("/trainingcontent");
  }
  removeHTMLInfo(value) {
    // if (value)
    //     return value.replace(/<\/?[^>]+>/gi,"");
  }

  ngOnInit() {
    // this.swipeLoad();
  }

  currentvideoindex: number = 0;
  lastIndex: any;
  sliderChanges(value) {}
  hide_prev_button: boolean = false;
  hide_next_button: boolean = false;
  swipeNexta() {
    // this.slider.lockSwipes(false);
    var self = this;
    this.slides.slideNext();
    this.slides.getActiveIndex().then((index) => {});
  }

  // swipeNext() {
  //   this.slides.slideNext();
  //   // Info about the current card and show/hide next/prev button
  //   this.slides.getActiveIndex().then((index) => {});
  //   this.slides.isBeginning().then((value) => {
  //     this.hide_prev_button = value ? true : false;
  //   });
  //   this.slides.isEnd().then((value) => {
  //     this.hide_next_button = value ? true : false;
  //   });
  // }

  //   swipeNext() {
  //     let total_slides: number = 0;
  //     let current_slide: number = 0;
  //     this.slides.length().then((number) => {
  //       total_slides = number;
  //     });

  //     this.slides.getActiveIndex().then((index) => {
  //       current_slide = index;

  //       if (parseInt("" + current_slide) + 1 < parseInt("" + total_slides)) {
  //         // do nothing
  //       } else {
  //         this.goto_submit_modal();
  //       }
  //     });
  //     this.slides.isBeginning().then((value) => {});
  //     this.slides.isEnd().then((value) => {});

  //     this.slides.slideNext();
  //   }

  //   swipePrev() {
  //     this.slides.slidePrev();
  //     // this.hide_next_button = false;
  //     //Info about the current card and show/hide next/prev button
  //     this.slides.getActiveIndex().then((index) => {
  //       // if(index == this.contentdata.length-1){
  //       // }else{
  //       //   this.disableSavebutton();
  //       // }
  //     });
  //     this.slides.isBeginning().then((value) => {
  //       // this.hide_prev_button = value ? true : false;
  //     });
  //     this.slides.isEnd().then((value) => {
  //       // this.hide_next_button = value ? true : false;
  //     });
  //   }

  async downloadFileConfirmation(url, filepath) {
    const alert = await this.alertController.create({
      header: "Confirmation",
      subHeader: "",
      message:
        "This file will be downloaded to your mobile. Do you want to download it?",
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
      duration: 3000,
    });
    await loading.present();

    let url = encodeURI(_url);
    this.fileTransferObj = this.transfer.create();

    this.fileTransferObj.onProgress((progressEvent) => {
      this.zone.run(() => {
        var perc = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        this.dlprogress = perc + " %";
        loading.message = this.dlprogress;
      });
    });

    this.fileTransferObj
      .download(url, filepath)
      .then((entry) => {
        this.dlprogress = "Download complete";
        this.toaster1("Download complete", 300);
        this.open_file(filepath);
        loading.dismiss();
      })
      .catch((err) => {
        this.dlprogress = "";
        alert("Error saving file: " + JSON.stringify(err));
        loading.dismiss();
      });
  }

  play_btn_click(content) {
    let file_type = content.content.split(".").pop();
    let file = this.getMIMEtype(file_type);
    var file_name = new Date().getTime();
    // let filepath = this.file.dataDirectory+'resources/'+file_name +  '.' + file_type;
    let filepath = this.file.dataDirectory + "/resources/" + content.vedio_path;
    let url = encodeURI(content.content);

    // check resource folder exists locally or not
    this.file
      .checkDir(this.file.dataDirectory, "resources")
      .then((_) => {
        // check the file exists inside it or not
        this.file
          .checkFile(
            this.file.dataDirectory,
            "resources" + "/" + content.vedio_path
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
          .createDir(this.file.dataDirectory, "resources", false)
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

  async delete_btn_click(content) {
    const alert = await this.alertController.create({
      header: "Confirmation",
      subHeader: "",
      message:
        "This file will be deleted permanently from your mobile. Do you still want to delete it?",
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
            this.delete_file(content);
          },
        },
      ],
    });
    await alert.present();
  }

  delete_file(content) {
    this.file
      .removeFile(
        this.file.dataDirectory,
        "resources" + "/" + content.vedio_path
      )
      .then((_) => {
        this.toaster1("File deleted successfully", 2000);
      })
      .catch((err) => {
        this.toaster1("File can not be deleted", 2000);
      });
  }

  async toaster1(message: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
    });
    toast.present();
  }

  disablebutton() {}

  Save(content) {
    // this.saveStatus();
    if (content.type == "vedio") {
      this.file
        .checkDir(this.file.dataDirectory, "resources")
        .then((res) => {
          this.file
            .checkFile(
              this.file.dataDirectory,
              "resources" + "/" + content.vedio_path
            )
            .then((response) => {
              if (response == true) {
                this.saveStatus();
              } else {
                this.showAlert(
                  "",
                  "",
                  "download and play video completely to save training"
                );
              }
            })
            .catch((err) => {
              // File Not Found Locally
              this.showAlert(
                "",
                "",
                "download and play video completely to save training"
              );
            });
        })
        .catch((err) => {
          this.showAlert(
            "",
            "",
            "download and play video completely to save training"
          );
        });
    } else {
      this.saveStatus();
    }
  }

  showbutton: boolean = false;

  enableSavebutton() {
    this.showbutton = true;
  }
  disableSavebutton() {
    this.showbutton = false;
  }

  async saveStatus() {
    if (this.save_operation == true) {
      const body = {
        userid: this._userid,
        username: this._username,
        moduleid: this.alldata.moduleid,
        modulename: this.alldata.modulename,
        submoduleid: this.alldata.submoduleid,
        submodulename: this.alldata.submodulename,
        content: JSON.stringify(this.contentdata),
        content_status: true,
        worksheet: "",
        worksheet_status: true,
        video: "",
        video_status: true,
        quiz_status: false,
        quiz: this.alldata.quiz,
        topicid: this.alldata.topicid,
        topicname: this.alldata.topicname,
        topic_percentage: "50%",
        language: this.language,
      };
      const loading = await this.loadingController.create({ duration: 5000 });
      await loading.present();
      await this.api.savetchtraining(body).subscribe(
        (res) => {
          this.navigateTraining();
          // this.showAlert('Training Session', '', 'Training session save ' + JSON.stringify(res.status));
          loading.dismiss();
          //this.navController.back();
          // this.navController.navigateBack('training1');
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
    } else if (this.save_operation == false) {
      const data = {
        content: this.contentdata,
        content_status: true,
        topic_percentage: "50%",
      };
      const loading = await this.loadingController.create({ duration: 5000 });
      await loading.present();
      await this.api
        .updatetchtraining(
          this._userid,
          this.alldata.moduleid,
          this.alldata.topicid,
          data
        )
        .subscribe(
          (res) => {
            if (res.status == "success") {
              this.navigateTraining();
              loading.dismiss();
            }
          },
          (err) => {
            loading.dismiss();
            this.serverDownMsg.presentToast();
          }
        );
    } else {
      //
    }
  }

  async navigateTraining() {
    const alert = await this.alertController.create({
      header: "Confirmation",
      subHeader: "",
      message: "Training session saved successfully",
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.navController.navigateBack("training1");
          },
        },
      ],
    });
    await alert.present();
  }

  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  async presentLoadingDefault() {
    let loading = await this.loadingController.create({
      message: "Please wait...",
      duration: 3000,
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      txt: "text/plain",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc: "application/msword",
      pdf: "application/pdf",
      jpg: "image/jpeg",
      bmp: "image/bmp",
      png: "image/png",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      rtf: "application/rtf",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      mp4: "video/mp4",
      flv: "video/x-flv",
      m3u8: "application/x-mpegURL",
      ts: "video/MP2T",
      "3gp": "video/3gpp",
      mov: "video/quicktime",
      avi: "	video/x-msvideo",
      wmv: "video/x-ms-wmv",
    };
    return MIMETypes[ext];
  }

  dlprogress: string = "";
  hide_dlprogressdiv: boolean = true;

  async deleteFile(filepath) {
    filepath.delete();
  }
  fileextension: any;

  async open_file(filepath) {
    this.fileextension = filepath.split(".").pop();
    let filemimetype = this.getMIMEtype(this.fileextension);
    this.dlprogress = "";
    this.hide_dlprogressdiv = true;
    this.fileOpener
      .open(filepath, filemimetype)
      .then(() => console.log("File is opened"))
      .catch((e) => {
        alert("File Not Found !!!");
      });
  }

  async toaster() {
    const toast = await this.toastCtrl.create({
      message:
        "You are unable to open this file please download associated application to open this file",
      duration: 3000,
    });
    toast.present();
  }

  viewFile(link) {
    let file_type = link.stored_url.split(".").pop();
    let file = this.getMIMEtype(file_type);
    this.fileOpener
      .open(link.stored_url, file)
      .then(() => {})
      .catch((e) => {
        this.toaster();
      });
  }

  async goto_submit_modal() {
    // if (
    //     this.transdata == undefined ||
    //     this.transdata == null ||
    //     this.transdata.length <= 0
    // ) {
    //     this.is_content_saved = false;
    //     this.is_quiz_saved = false;
    // } else {
    //     if (
    //         this.transdata.content_status == undefined ||
    //         this.transdata.content_status == null
    //     ) {
    //         this.is_content_saved = false;
    //     } else if (this.transdata.content_status == false) {
    //         this.is_content_saved = false;
    //     } else if (this.transdata.content_status == true) {
    //         this.is_content_saved = true;
    //     } else {
    //         this.is_content_saved = false;
    //     }
    //     if (
    //         this.transdata.quiz_status == undefined ||
    //         this.transdata.quiz_status == null
    //     ) {
    //         this.is_quiz_saved = false;
    //     } else if (this.transdata.quiz_status == false) {
    //         this.is_quiz_saved = false;
    //     } else if (this.transdata.quiz_status == true) {
    //         this.is_quiz_saved = true;
    //     } else {
    //         this.is_quiz_saved = false;
    //     }
    // }

    const modal = await this.modalController.create({
      component: ContentdetailsmodalPage,
      componentProps: {
        res: {
          is_content_saved: this.is_content_saved,
          is_quiz_saved: this.is_quiz_saved,
          data: {
            userid: this._userid,
            username: this._username,
            moduleid: this.alldata.moduleid,
            modulename: this.alldata.modulename,
            submoduleid: this.alldata.submoduleid,
            submodulename: this.alldata.submodulename,
            topicid: this.alldata.topicid,
            topicname: this.alldata.topicname,
            language: this.language,
            content: this.contentdata,
            content_status: true,
            quiz: this.alldata.quiz,
            quiz_status: false,
            score: 0,
            totalmark: 0,
            quiz_completion_time: "0",
            topic_percentage: "50%",
          },
        },
      },
      cssClass: "half-modal",
    });
    modal.onDidDismiss().then((data) => {
      // do something
    });
    return await modal.present();
  }

  applyIcons() {
    for (var l = 0; l < (this.links || []).length; l++) {
      const http_url = this.links[l];
      const stored = this.storedFiles.find(
        (f) => f.Hyper_URL == http_url.content
      );
      if (stored) {
        this.links[l].stored = true;
        this.links[l].stored_url = stored.Native_URL;
      } else {
        this.links[l].stored = false;
      }
    }
  }

  //time spent module
  setTime() {
    if (this.timeSpend == null) {
      // console.log("setTime called");
      localStorage.setItem("_timeSpent", this.timeSpent.toString());
      this.timeSpend = localStorage.getItem("_timeSpent");
    }
  }

  // timeDiffCalc(startTime, endTime) {
  //   // console.log("timecalc");
  //   let diffInMilliSeconds = Math.abs(startTime - endTime) / 1000;

  //   // calculate hours
  //   const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  //   diffInMilliSeconds -= hours * 3600;
  //   // this.timeSpent += hours === 0 || hours === 1 ? hours : hours;

  //   // calculate minutes
  //   const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  //   diffInMilliSeconds -= minutes * 60;
  //   this.timeSpent += minutes === 0 || hours === 1 ? minutes : minutes;

  //   //calculate seconds
  //   // const seconds = Math.floor(diffInMilliSeconds) % 60;
  //   // diffInMilliSeconds -= seconds;
  //   // this.timeSpent += seconds === 0 || minutes === 1 ? seconds : seconds;

  //   return this.timeSpent;
  // }

  // setDate() {
  //   // console.log("setDate Dt: ", this.currentDate);
  //   if (this.currentDate == null) {
  //     this.currentDate = new Date().getDate();
  //     // console.log("setDt check", typeof this.currentDate);
  //     localStorage.setItem("_date", this.currentDate);
  //   }
  // }

  async saveTimeData() {
    // console.log("dtCheck", this.currentDate, this.savedDate);
    // if (this.currentDate != this.savedDate) {
    //   // console.log("saveTimeData called");
    //   this.timeSpentData =
    //     "Date: " + this.savedDate + ", Time Spend: " + this.timeSpend;
    //   localStorage.setItem("_timeData", this.timeSpentData);
    //   this.timeSpend = 0;
    //   this.currentDate = null;
    // }

    let data = {
      userid: this._userid,
      starttime: this.startTime,
      endtime: this.endTime,
      year: this.year,
    };
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.savetimespentdata(data).subscribe(
      (res) => {
        if (res["status"]) {
          // this.showAlert(this.messagehead, "", this.msg_success);
        }
        loading.dismiss();
        // this.modalController.dismiss({ data: "Ok" });
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async gettimespentdata() {
    // let month = 7;
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .getalltimespentdatabymonth(this._userid, this.year)
      .subscribe(
        (res) => {
          console.log("check timespentdata", res);
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }
}
