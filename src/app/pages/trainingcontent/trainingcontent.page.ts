import { Component, NgZone, ViewChild, ElementRef } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { Router, NavigationExtras } from "@angular/router";

// Modals
import { SearchFilterPage } from "../../pages/modal/search-filter/search-filter.page";
import { ImagePage } from "./../modal/image/image.page";
// Call notifications test by Popover and Custom Component.
import { Statusmodal1Page } from "../modal/statusmodal1/statusmodal1.page";

// api
import { RestApiService } from "./../../rest-api.service";

// Camera
import { Camera } from "@ionic-native/camera/ngx";
// Geolocation
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-trainingcontent",
  templateUrl: "./trainingcontent.page.html",
  styleUrls: ["./trainingcontent.page.scss"],
})
export class TrainingContentPage {
  module_data: any;
  selectedIdx: any;
  sub_module_data: any;
  module_id: any;
  all_contents: any;
  selected_moduleid: string;
  topic_contents: any;
  items: any = [];
  close = false;
  totalCount: any;
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  toolbarshadow = true;
  levels = [1, 2, 3, 4, 5];
  ece_levels = [1, 2, 3];
  errormessage = "";
  displaystudent: any;
  countEce;
  countPge;
  showAction = [];
  language: string;
  i = 0;

  appStartTime: any;
  appEndTime: any;
  timeSpent = 0;
  timeSpend: any = 0;
  sumOfTimeSpent = 0;
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
    private serverDownMsg: ServerDownService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";
    this.language = localStorage.getItem("_language");

    // this.appStartTime = new Date().getTime();
    this.timeSpend = localStorage.getItem("_timeSpent");
    // this.timeReset();
  }

  ngOnInit() {
    this.getAllModule(this._userid, this.language);
  }

  calltoroot() {
    //------>>>Time Spent module commented because not required in app idle state<<<------
    // this.appEndTime = new Date().getTime();
    // this.timeDiffCalc(this.appStartTime, this.appEndTime);
    // this.sumOfTimeSpent = this.timeSpent + parseInt(this.timeSpend);
    // localStorage.setItem("_timeSpent", this.sumOfTimeSpent.toString());
    // this.timeSpend = localStorage.getItem("_timeSpent");
    // this.timeSpend = parseInt(localStorage.getItem("_timeSpent"));

    this.navController.navigateBack("/home-results");
  }

  async getAllModule(userid, language) {
    await this.api.getAllModule(userid, language).subscribe(
      (res) => {
        this.module_data = res.modulesarr;
        console.log("---->>>>>", this.module_data);
        console.log(this.module_data[0].moduleid, this.module_data.length);
        if (this.module_data.length > 0) {
          this.getSubmoduleDetails(this.module_data[0].moduleid, language);
        } else {
          this.showMessage = true;
        }
      },
      (err) => {
        this.showAlert(
          "Profile Error",
          "",
          "Unable to fetch user profile by this time"
        );
      }
    );
  }

  showMsg: boolean = false;
  showMessage: boolean = false;
  segmentChanged(ev: any) {}
  changeMenus(value) {
    this.selected_moduleid = value.moduleid;
    this.module_id = value.moduleid;
    this.getSubmoduleDetails(this.module_id, this.language);
  }

  async getSubmoduleDetails(moduleid, language) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    this.selected_moduleid = moduleid;

    await this.api.gettrainingcontents(moduleid, language).subscribe(
      (res) => {
        if (res.length > 0) {
          this.showMsg = false;
          res.forEach(function (data) {
            data.topicdetails.forEach(function (value) {
              value.topic_percentage = "0%";
            });
          });
        } else {
          console.log("else");
          this.showMsg = true;
        }
        loading.dismiss();
        this.getUserDetails(res, this._userid, moduleid);
      },
      (err) => {
        this.showAlert("Module Error", "", "Unable to fetch Module details");
        loading.dismiss();
      }
    );
  }

  async getUserDetails(trainingdata, userid, moduleid) {
    await this.api.getmoduledetails(userid, moduleid, this.language).subscribe(
      (res) => {
        if (res.length > 0) {
          // this.showMsg = false;
          trainingdata.forEach(function (data, index) {
            data.topicdetails.forEach(function (value, index1) {
              value.topic_percentage = "0%";
              res.forEach(function (res, index) {
                if (res.topicid == value.topicid) {
                  value.topic_percentage = res.topic_percentage;
                }
              });
            });
          });
        } else {
        }
        this.all_contents = trainingdata;
      },
      (err) => {
        console.log(err);
        this.serverDownMsg.presentToast();
        // loading.dismiss();
      }
    );
  }

  async goToTopicPage(topicdetail, submoduleid) {
    await this.api
      .gettrainingcontentsdata(
        this.selected_moduleid,
        submoduleid,
        topicdetail.topicid,
        this.language
      )
      .subscribe(
        (res) => {
          this.topic_contents = res;
          const navigationExtras: NavigationExtras = {
            queryParams: {
              parameters: this.topic_contents,
            },
          };
          this.navController.navigateForward(
            "/contentdetails",
            navigationExtras
          );
        },
        (err) => {
          this.showAlert(
            "Content Error",
            "",
            "Unable to fetch content details"
          );
        }
      );
  }

  async showDetails(details) {
    const modal = await this.modalController.create({
      component: Statusmodal1Page,
      cssClass: "transparent-modal",
      componentProps: {
        res: {
          submodule_details: details,
        },
      },
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }

  // alert box
  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ["OK"],
    });

    await alert.present();
  }

  //------>>>Time Spent module commented because not required in app idle state<<<------
  // timeReset() {
  //   if (this.timeSpend == null) {
  //     localStorage.setItem("_timeSpent", this.timeSpent.toString());
  //     this.timeSpend = localStorage.getItem("_timeSpent");
  //   }
  // }

  // timeDiffCalc(startTime, endTime) {
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
}
