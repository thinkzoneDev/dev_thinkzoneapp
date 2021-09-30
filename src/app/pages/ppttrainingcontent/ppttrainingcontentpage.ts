import { Component, NgZone } from "@angular/core";
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
import { NotificationsComponent } from "./../../components/notifications/notifications.component";
import { BaselinePage } from "./../modal/baseline/baseline.page";

// api
import { RestApiService } from "./../../rest-api.service";

// Camera
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
// Geolocation
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StudentregisterPage } from "../studentregister/studentregister.page";
import { StatusmodalPage } from "../modal/statusmodal/statusmodal.page";
import { isoStringToDate } from "@angular/common/src/i18n/format_date";

@Component({
  selector: "app-ppttrainingcontent",
  templateUrl: "./ppttrainingcontent.page.html",
  styleUrls: ["./ppttrainingcontent.page.scss"],
})
export class PPTTrainingContentPage {
  [x: string]: any;
  selected_month: boolean;
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
  resetBackButton: any;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private zone: NgZone,
    private loadingController: LoadingController,
    private camera: Camera,
    private router: Router
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";
    this.language = localStorage.getItem("_language");
  }

  ngOnInit() {
    this.getAllModule(this._userid, this.language);
  }

  async getAllModule(userid, language) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getpptAllModule(userid, language).subscribe(
      (res) => {
        console.log("iam here", res);
        this.module_data = res;
        loading.dismiss();
        console.log("module_data", this.module_data);
        if (this.module_data.length > 0) {
          this.getSubmoduleDetails(this.module_data[0].moduleid, language);
        } else {
          this.showMessage = true;
        }
      },
      (err) => {
        loading.dismiss();
        console.log("err--->>>", err);
        if (err) {
          this.showAlert(
            "Network error",
            "",
            "Please check back after sometime"
          );
        }
      }
    );
  }

  showMsg: boolean = false;
  showMessage: boolean = false;
  segmentChanged(ev: any) {}
  changeMenus(value) {
    this.module_id = value.moduleid;
    this.getSubmoduleDetails(this.module_id, this.language);
    this.selected_moduleid = value.moduleid;
  }
  async getSubmoduleDetails(moduleid, language) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    this.selected_moduleid = moduleid;
    await this.api.getppttrainingcontents(moduleid, language).subscribe(
      (res) => {
        console.log("res-->>", res);
        if (res.length > 0) {
          this.showMsg = false;
          res.forEach(function (data, index) {
            data.topicdetails.forEach(function (value, index1) {
              value.topic_percentage = "0%";
            });
          });
        } else {
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
    // console.log("trainingdata",trainingdata)
    await this.api
      .getpptmoduledetails(userid, moduleid, this.language)
      .subscribe(
        (res) => {
          if (res.length > 0) {
            // this.showMsg = false;
            console.log("-->>", res);
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
          // loading.dismiss();
        }
      );
  }

  async goToTopicPage(topicdetail, submoduleid) {
    await this.api
      .getppttrainingcontentsdata(
        this.selected_moduleid,
        submoduleid,
        topicdetail.topicid,
        this.language
      )
      .subscribe(
        async (res) => {
          this.topic_contents = res;
          // console.log("hello", this.topic_contents);
          // get details from trans table- nrusingh 16-03-2021
          await this.api
            .getppttopicdetails(
              this._userid,
              this.selected_moduleid,
              submoduleid,
              topicdetail.topicid
            )
            .subscribe(
              (res2) => {
                const navigationExtras: NavigationExtras = {
                  queryParams: {
                    parameters: this.topic_contents,
                    trans_parameters: res2,
                  },
                };
                //this.navController.navigateForward('/ppttopiccontent', navigationExtras);
                this.navController.navigateForward(
                  "/pptcontentdetails",
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
      component: StatusmodalPage,
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

  calltoroot() {
    this.navController.navigateBack("/home-results");
  }
  // --------------- added by nrusingh on 10.01.2020 for search option for students -----------------
}
