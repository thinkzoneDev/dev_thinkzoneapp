import { Component, Input, ViewChild } from "@angular/core";
import { NgModule } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { RestApiService } from "./../../rest-api.service";
import { Training2Page } from "../training2/training2.page";
import { DataService } from "src/app/services/data.service";
import { TranslateConfigService } from "./../../translate-config.service";
import { IonSlides } from "@ionic/angular";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-training1",
  templateUrl: "./training1.page.html",
  styleUrls: ["./training1.page.scss"],
})
@NgModule({
  declarations: [],
  imports: [],
})
export class Training1Page {
  slideOpts: any;

  @ViewChild("slider") slider: IonSlides;

  public allmodule_list: any = [];

  public allmodule_name: any[];

  public allsubmodule_list: any = [];

  toolbarshadow = true;
  init_module = "";

  public profile_data: any = [];
  userid: string = "";
  username: string = "";
  language: string = "";
  usertype: string = "";
  gender: string = "";
  dob: string = "";
  regdate: string = "";
  emailid: string = "";
  contactno: string = "";
  address: string = "";
  bdate;
  bmonth;
  byear;

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  selectedLanguage: string;
  hide_class_field = false;
  ppt_status: boolean = false;
  baseline_status: boolean = false;
  showbaseline: boolean = true;
  options = {
    slidesPerView: 1.2,
    centeredSlides: true,
  };
  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    public dataService: DataService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this.language = localStorage.getItem("_language");
    this._centerid = "";
    this._centername = "";
    this.getUserProfile();
    this.ppt_trans_getoverallstatus();
    this.baselineStatus();
    this.slideOpts = {
      initialSlide: 0,
      runCallbacksOnInit: true,
      centeredSlides: true,
      loop: true,
      pager: true,
      slidesPerView: 1,
      autoplay: true,
      spaceBetween: 10,
    };
  }
  onClickBaseline(value) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        parameters: value,
      },
    };
    this.navController.navigateForward(
      "/teacherbaselinedndline",
      navigationExtras
    );
  }
  //check perticular user has submitted baseline test or not

  async baselineStatus() {
    if (
      localStorage.getItem("_language") == undefined ||
      localStorage.getItem("_language") == null ||
      localStorage.getItem("_language") == ""
    ) {
      this.selectedLanguage = "en";
    } else {
      this.selectedLanguage = localStorage.getItem("_language");
    }
    await this.api
      .getbaselinedetails(
        "baseline",
        this.selectedLanguage,
        localStorage.getItem("_userid")
      )
      .subscribe(
        (res) => {
          if (res.length > 0 && res[0].type == "baseline") {
            this.baseline_status = true;
            this.showbaseline = false;
          } else {
            this.baseline_status = false;
            this.showbaseline = true;
          }
        },
        (err) => {}
      );
  }
  async ppt_trans_getoverallstatus() {
    await this.api
      .ppt_trans_getoverallstatus(this._userid, this.language)
      .subscribe(
        (res) => {
          if (Object.keys(res).length > 0) {
            if (res["status"] == "complete") {
              this.ppt_status = true;
            } else {
              this.ppt_status = false;
            }
          } else {
            this.ppt_status = false;
          }
        },
        (err) => {
          console.log("###Error: ", err);
        }
      );
  }

  async navigate_to_training_module() {
    // if (this.ppt_status == true) {
    //     this.navController.navigateForward("trainingcontent");
    // } else {
    //     this.showAlert(
    //         "Info",
    //         "",
    //         "You have to complete Pre program training (PPT) to browse this module."
    //     );
    // }
    this.navController.navigateForward("trainingcontent");
  }

  async navigate_to_ppt_module() {
    // if (this.baseline_status == false) {
    //   this.navController.navigateForward("ppttrainingcontent");
    // } else {
    //   this.showAlert(
    //     "Info",
    //     "",
    //     "You have to complete Baseline test to browse this module."
    //   );
    // }
    this.navController.navigateForward("ppttrainingcontent");
  }
  async navigate_to_teacherbaseline() {
    this.navController.navigateForward("teacherbaselinedndline");
  }

  async getUserProfile() {
    await this.api.getuserbyuserid(this._userid).subscribe(
      (res) => {
        this.profile_data = res;
        if (this.profile_data.length > 0) {
          this.username = this.profile_data[0].username;
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

  reloadData($event) {}
  async getAllSubmodules(moduleid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltrainingsubmodules(moduleid).subscribe(
      (res) => {
        this.allsubmodule_list = res;
        this.allsubmodule_list.forEach((element) => {
          element.progress = Math.round(Math.random() * 100); // change this to original value
        });

        this.createSubmodulesModal();
        loading.dismiss();
      },
      (err) => {
        console.log(err);
        loading.dismiss();
        this.showAlert(
          "Teacher training",
          "",
          "Unable to fetch modules at this time !!!"
        );
      }
    );
  }

  async createSubmodulesModal() {
    this.dataService.setData("submodules", this.allsubmodule_list);
    this.navController.navigateForward("trainingsubs");
  }

  module_select_onchange(value) {
    this.allmodule_name.forEach((element) => {
      element.selected = false;
    });
    value.selected = true;
    this.getAllSubmodules(value.moduleid);
  }

  async submodule_click(submodule) {
    // call eng assessment modal
    const modal = await this.modalController.create({
      component: Training2Page,
      componentProps: { res: { submodule: submodule } },
    });
    modal.onDidDismiss().then((data) => {
      // this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
    });
    return await modal.present();
  }

  async explor() {
    this.navController.navigateForward("/profile");
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
  // confirm box
  async showConfirm(
    header: string,
    subHeader: string,
    message: string,
    body: any
  ) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Ok",
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  calltoroot() {
    this.navController.navigateBack("/home-results");
  }
}
