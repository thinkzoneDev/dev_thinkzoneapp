import { Component, ViewChild, NgZone } from "@angular/core";
import {
  NavController,
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";
import { PptsubmitmodalPage } from "./../modal/pptsubmitmodal/pptsubmitmodal.page";
import { RestApiService } from "./../../rest-api.service";
import { ServerDownService } from "src/app/services/server-down.service";
@Component({
  selector: "app-pptcontentdetails",
  templateUrl: "./pptcontentdetails.page.html",
  styleUrls: ["./pptcontentdetails.page.scss"],
})
export class PPTContentDetailsPage {
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
  storedFiles = [];
  alldata: any;
  transdata: any;
  contentstatus: boolean = false;
  autoplay: boolean = false;
  language: string;
  hide_prev_button: boolean = false;
  hide_next_button: boolean = false;
  currentvideoindex: number = 0;
  lastIndex: any;
  save_operation: boolean = false;
  contentstatus1: boolean = false;
  toolbarshadow = true;
  is_content_saved: boolean = false;
  is_quiz_saved: boolean = false;

  constructor(
    public navController: NavController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private zone: NgZone,
    // private sanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private transfer: FileTransfer,
    public file: File,
    // public file: File
    private fileOpener: FileOpener,
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
        this.alldata = params.parameters ? params.parameters[0] : {};
        this.transdata = params.trans_parameters
          ? params.trans_parameters[0]
          : {};

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
          //this.hide_next_button = true;
        }
        this.links = this.contentdata;
        this.getTchTraaining_status(
          this._userid,
          this.alldata.moduleid,
          this.alldata.submoduleid,
          this.alldata.topicid
        );
      }
    });
  }

  current_segment: any = 0;

  next(ind) {
    console.log("ind-->", ind, "   total-->", this.contentdata.length);

    if (ind < this.contentdata.length - 1) {
      this.current_segment = ind + 1;
    } else if (ind == this.contentdata.length - 1) {
      // this.hide_next_button = true;
      this.goto_submit_modal();
    }
  }

  prev(ind) {
    if (ind > 0) this.current_segment = ind - 1;
  }

  async getTchTraaining_status(uid, mid, sid, tid) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getppttopicdetails(uid, mid, sid, tid).subscribe(
      (res) => {
        console.log("getppttopicdetails", res);
        if (res.length > 0) {
          this.save_operation = false;
          if (res[0].content_status == true) {
            this.is_content_saved = true;
          }
        } else {
          this.save_operation = true;
          this.contentstatus1 = false;
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  ngOnInit() {
    // this.swipeLoad();
  }

  ngAfterViewInit() {}

  transform(url) {
    // return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  removeHTMLInfo(value) {
    // if (value)
    //     return value.replace(/<\/?[^>]+>/gi,"");
  }

  sliderChanges(value) {}

  swipeNexta() {
    // this.slider.lockSwipes(false);
    var self = this;
    this.slides.slideNext();
    this.slides.getActiveIndex().then((index) => {});
  }

  swipeNext() {
    let total_slides: number = 0;
    let current_slide: number = 0;
    this.slides.length().then((number) => {
      total_slides = number;
    });

    this.slides.getActiveIndex().then((index) => {
      current_slide = index;
      if (parseInt("" + current_slide) + 1 < parseInt("" + total_slides)) {
        // do nothing
      } else {
        this.goto_submit_modal();
      }
    });
    this.slides.isBeginning().then((value) => {});
    this.slides.isEnd().then((value) => {});
    this.slides.slideNext();
  }

  swipePrev() {
    this.slides.slidePrev();
    // this.hide_next_button = false;
    //Info about the current card and show/hide next/prev button
    this.slides.getActiveIndex().then((index) => {
      // if(index == this.contentdata.length-1){
      // }else{
      //   this.disableSavebutton();
      // }
    });
    this.slides.isBeginning().then((value) => {
      //this.hide_prev_button = (value) ? true : false;
    });
    this.slides.isEnd().then((value) => {
      //this.hide_next_button = (value) ? true : false;
    });
  }

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
      await this.api.saveppttchtraining(body).subscribe(
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
        .updateppttchtraining(
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
      message: "Training session saved successfully,Now answer the questions",
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.navController.navigateForward("/pptquiz");
            // this.navController.navigateBack('pptquiz')
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
  // applyIcons(){
  //   for(var l =0; l< (this.links || []).length; l++){
  //     const http_url = this.links[l];
  //     const stored = this.storedFiles.find((f) => f.Hyper_URL == http_url.content);
  //     if(stored){
  //       this.links[l].stored = true;
  //       this.links[l].stored_url = stored.Native_URL;
  //     }else{
  //       this.links[l].stored = false;
  //     }
  //   }
  // }
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
    const modal = await this.modalController.create({
      component: PptsubmitmodalPage,
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

    return await modal.present();
  }

  calltoroot() {
    this.navController.navigateBack("/ppttrainingcontent");
  }
}
