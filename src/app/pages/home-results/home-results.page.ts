import { Component, ViewChild, NgZone } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  RouterLinkDelegate,
} from "@ionic/angular";

// Modals
import { SearchFilterPage } from "../../pages/modal/search-filter/search-filter.page";
import { ImagePage } from "./../modal/image/image.page";
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from "./../../components/notifications/notifications.component";
import { RestApiService } from "./../../rest-api.service";
import { HblRegisterPage } from "../hbl-register/hbl-register.page";
import { TranslateConfigService } from "./../../translate-config.service";
import { Router, NavigationEnd, NavigationExtras } from "@angular/router";
import { IonSlides } from "@ionic/angular";

// User profile Image service
import { UserprofileimageService } from "./../../services/userprofileimage.service";
import { UserUnreadMessageService } from "./../../services/userunreadmessage.service";
import { AppComponent } from "./../../app.component";
import { UpdatepagePage } from "../../updatepage/updatepage.page";
import { PgeactivitymodalPage } from "../modal/pgeactivitymodal/pgeactivitymodal.page";
import { TermsAndConditionsPage } from "../../terms-and-conditions/terms-and-conditions.page";
import { StudentregisterPage } from "../studentregister/studentregister.page";
import { StudentregisterbytypePage } from "../studentregisterbytype/studentregisterbytype.page";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-home-results",
  templateUrl: "./home-results.page.html",
  styleUrls: ["./home-results.page.scss"],
})
export class HomeResultsPage {
  _isguestuser: boolean =
    localStorage.getItem("_isguestuser") == "yes" ? true : false;
  slideOpts: any;
  _username: string = localStorage.getItem("_username");
  searchKey = "";
  yourLocation = "123 Test Street";
  themeCover = "assets/img/ionic4-Start-Theme-cover.jpg";
  userid: String = localStorage.getItem("_userid");
  action: any;
  value: any;
  eceactivity: String;
  isliked: Boolean = false;
  isliked2: boolean = false;
  isliked3: boolean = false;
  isliked4: boolean = false;
  current_date: string;
  centers: any;
  date: number;
  month: string;
  app_package: string = "";
  top: boolean;
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  toolbarshadow = true;

  dlprogress: string = "";
  txt_url: string = "";
  txt_ext: string = "";

  unreadcount: any;
  showunread: boolean = false;
  _userid: string;
  usertype: string;
  countEce = 0;
  countPge = 0;
  totalCount: any;

  student_list: any = [];
  errormessage = "";
  msg_heading: string = "";
  msg: string = "";
  @ViewChild("slider") slider: IonSlides;
  language: string;
  ppt_status: boolean = false;
  image_array: any;
  title_present: boolean;

  isFellow: boolean;
  isAnganwadiOrFellow: boolean;
  isSchoolOrFellow: boolean;
  profile_data: any;
  profile_image: any;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingController: LoadingController,
    public api: RestApiService,
    private route: Router,
    private userprofileimageService: UserprofileimageService,
    private userunreadmessage: UserUnreadMessageService,
    private _ngZone: NgZone,
    private parent: AppComponent,
    private serverDownMsg: ServerDownService
  ) {
    this._username = localStorage.getItem("_username");
    //parent.user_profile_image = userprofileimageService.getuserprofileimage();
    this.language = localStorage.getItem("_language");
    // parent.user_unread_message = userunreadmessage.getuserunreadMessage();
    this._userid = localStorage.getItem("_userid");
    this.usertype = localStorage.getItem("_usertype");
    this.checkUsertype();

    this.slideOpts = {
      initialSlide: 0,
      runCallbacksOnInit: false,
      centeredSlides: true,
      loop: true,
      pager: true,
      slidesPerView: 1,
      autoplay: true,
      spaceBetween: 10,
    };

    this.centers = [];
    this.api.getcurrentdate().subscribe(
      (res) => {
        if (res != undefined && res != null && Object.keys(res).length > 0) {
          this.current_date = res["current"];
        } else {
          this.current_date = "";
        }
      },
      (err) => {
        // serverDownMsg.presentToast();
      }
    );

    this.api
      .getallcentersallocatedbyuserid(localStorage.getItem("_userid"))
      .subscribe(
        (res) => {
          if (res != undefined && res != null && Object.keys(res).length > 0) {
            this.centers = res[0]["centers"];
          } else {
            this.centers = [];
          }
        },
        (err) => {
          // serverDownMsg.presentToast();
        }
      );

    const dt = new Date();
    this.date = dt.getDate();
    this.month = this.months[dt.getMonth()];
    this.setCheckinTime();
    this.fcm_token_sync();
    this.ppt_trans_getoverallstatus();
    this.getalldashboardslides();
  }

  generateName(): string {
    const date: number = new Date().valueOf();
    let text: string = "";
    const possibleText: string =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
    }
    // Replace extension according to your media type like this
    return date + "." + text + ".jpeg";
  }

  ngOnInit() {
    this.getfeedback();
    this.userunreadmessage.getuserunreadMessage().subscribe(
      (data) => {
        if (Object.keys(data).length > 0) {
          this.unreadcount = Object.keys(data).length;
          this.showunread = true;
        } else {
          this.showunread = false;
        }
      },
      (error) => {},
      () => {}
    );

    this.parent._userid = localStorage.getItem("_userid");
    this.parent._username = localStorage.getItem("_username");
    this.parent.profile_image = localStorage.getItem("_profile_image");
    //this.getUserProfile();
    console.log("Home results local->", localStorage);
  }

  async check_for_update(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: UpdatepagePage,
      event: ev,
      animated: true,
      backdropDismiss: true,
      cssClass: "contact-popover",
    });
    return await popover.present();
  }

  async DismissClick() {
    await this.popoverCtrl.dismiss();
  }

  checkUsertype() {
    //console.log("usertype -->", this.usertype);

    if (this.usertype == "fellow") {
      this.isFellow = true;
      this.isSchoolOrFellow = true;
      this.isAnganwadiOrFellow = true;
    } else if (this.usertype == "school") {
      this.isFellow = false;
      this.isSchoolOrFellow = true;
      this.isAnganwadiOrFellow = false;
    } else if (this.usertype == "anganwadi") {
      this.isFellow = false;
      this.isSchoolOrFellow = false;
      this.isAnganwadiOrFellow = true;
    }else{
      this.isFellow = true;
      this.isSchoolOrFellow = true;
      this.isAnganwadiOrFellow = true;
    }
  }

  async setCheckinTime() {
    let obj = {
      userid: localStorage.getItem("_userid"),
      username: localStorage.getItem("_username"),
      checkintime: new Date(),
    };
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.setcheckintime(obj).subscribe(
      (res) => {
        if (res.document_id != undefined && res.document_id != null) {
          localStorage.setItem("_document_id", res.document_id);
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        // this.serverDownMsg.presentToast();
      }
    );
  }

  centerButtonClicked(center: any) {
    if (Object.keys(center).length > 0) {
      localStorage.setItem("_operationdate", this.current_date);
      localStorage.setItem("_centerid", center.centerid);
      localStorage.setItem("_centername", center.centername);
      this.navController.navigateForward("/center");
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.slider.startAutoplay();
  }

  settings() {
    this.navController.navigateForward("settings");
  }

  async alertLocation() {
    const changeLocation = await this.alertCtrl.create({
      header: "Change Location",
      message: "Type your Address.",
      inputs: [
        {
          name: "location",
          placeholder: "Enter your new Location",
          type: "text",
        },
      ],
      buttons: [
        { text: "Cancel", handler: (data) => {} },
        {
          text: "Change",
          handler: async (data) => {
            this.yourLocation = data.location;
            const toast = await this.toastCtrl.create({
              message: "Location was change successfully",
              duration: 3000,
              position: "top",
              closeButtonText: "OK",
              showCloseButton: true,
            });
            toast.present();
          },
        },
      ],
    });
    changeLocation.present();
  }

  async searchFilter() {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage,
    });
    return await modal.present();
  }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image },
    });
    return await modal.present();
  }

  async notifications(ev: any) {
    this.navController.navigateForward("/message");
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  ionViewDidEnter() {
    this.slider.update();
  }

  ionViewWillLeave() {
    this.slider.stopAutoplay();
  }

  async getfeedback() {
    const body = {
      userid: this.userid,
    };
    this.api.gettchfeedback(body).subscribe(
      (res) => {
        this.value = res;
        this.isliked = this.value.is_like;
      },
      (err) => {
        // this.serverDownMsg.presentToast();
      }
    );
  }

  isLiked(activity_name) {
    var act_res = (this.value || []).find(
      (a) => a.activity_name == activity_name
    );
    if (act_res) return act_res.is_like || false;
  }

  async feedback_update(action, activity_name) {
    {
      this.isliked = action === "like";
      const body = {
        userid: this.userid,
        is_like: this.isliked,
        activity_name: activity_name,
        feedback: "",
      };
      // const loading = await this.loadingController.create({});
      // await loading.present();
      await this.api.savetchfeedback(body).subscribe(
        (res) => {
          this._ngZone.run(() => {
            var act_res_index = (this.value || []).findIndex(
              (a) => a.activity_name == activity_name
            );
            if (act_res_index >= 0)
              this.value[act_res_index].is_like = this.isliked;
          });
        },
        (err) => {
          var act_res_index = (this.value || []).findIndex(
            (a) => a.activity_name == activity_name
          );
          if (act_res_index >= 0)
            this.value[act_res_index].is_like = this.isliked;
        }
      );
      //this.nav
    }
  }

  feedback1_update(action) {}
  feedback2_update(action) {}
  feedback3_update(action) {}

  // FCM Token Sync to DB
  fcm_token_sync() {
    let uid = localStorage.getItem("_userid");
    let uname = localStorage.getItem("_username");
    let fcm_token = localStorage.getItem("fcm_token");
    let fcm_rtoken = localStorage.getItem("fcm_rtoken");
    // console.log("3.dashboard FCM Token: " + fcm_token);
    // console.log("3.dashboard FCM RToken: " + fcm_rtoken);
    let obj = {
      userid: uid,
      username: uname,
      token: fcm_token,
      refresh_token: fcm_rtoken,
    };
    // check token details of the user is saved in db or not
    this.api.getfcmtokenidbyuserid(uid).subscribe(
      (res1) => {
        // if present update
        if (res1.length > 0) {
          const tid = res1[0]["_id"];
          this.api.updatefcmtokenid(tid, obj).subscribe((res2) => {
            // console.log("###update token response: ", JSON.stringify(res2));
          });
        }
        // else create new
        else {
          this.api.createnewfcmtokenid(obj).subscribe((res3) => {
            // console.log("###save token response: ", JSON.stringify(res3));
          });
        }
      },
      (err) => {
        // this.serverDownMsg.presentToast();
      }
    );
  }
  //NEW CODE FOR DASHBOARD MODIFICATION

  openDictionary() {
    this.route.navigate(["/dictionary"]);
  }

  openGallery() {
    this.route.navigate(["/manager-box"]);
  }

  openPayment() {
    this.route.navigate(["/tchpayment"]);
  }

  async openPrivacy() {
    this.route.navigate(["/hrpolicy"]);
  }

  navigate_to_ppt_module() {
    this.route.navigate(["/ppttrainingcontent"]);
  }

  navigate_to_training_module() {
    this.navController.navigateForward("trainingcontent");
  }

  openHBLModule() {
    this.route.navigate(["/hbl"]);
  }

  openHBLRegister() {}

  openHBLActivity() {
    this.route.navigate(["/hbl-activity"]);
  }

  openECEActivity() {
    this.route.navigate(["/ecactivity"]);
  }

  openECEAssesment() {
    this.route.navigate(["/ecassessment"]);
  }

  async openPGEActivity() {
    const modal = await this.modalCtrl.create({
      component: PgeactivitymodalPage,
      componentProps: {},
      cssClass: "half-modal",
    });
    return await modal.present();
  }

  openPGEAssesment() {
    this.route.navigate(["/pgassessment"]);
  }

  openBaseline(value) {
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
  openStudentDetails() {
    this.route.navigate(["/studentexplor"]);
  }

  openAttendance() {
    this.route.navigate(["/attendance"]);
  }

  //HBL STUDENT REGISTRATION

  async openRegisterModal(studentObj, flag) {
    const modal = await this.modalCtrl.create({
      component: HblRegisterPage,
      componentProps: { res: { flag: flag, studentObj: studentObj } },
    });
    modal.onDidDismiss().then((data) => {
      this.getallstudents_hbl(this._userid);
    });
    return await modal.present();
  }

  async getallstudents_hbl(userid) {
    const loading = await this.loadingController.create({ duration: 3000 });
    await loading.present();
    await this.api.getallstudents(userid).subscribe(
      async (res) => {
        this.getProgramCount(res);
        this.student_list = res;
        loading.dismiss();
        if (this.student_list == "") {
          // this.showAlert(this.msg_heading, "", this.msg);
        }
        loading.dismiss();
      },
      (err) => {
        this.errormessage = err;
        this.student_list = [];
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  getProgramCount(res) {
    let countPge = 0;
    let countEce = 0;
    res.forEach((element) => {
      if (
        (element.class && element.class === "1") ||
        (element.class && element.class === "2") ||
        (element.class && element.class === "3") ||
        (element.class && element.class === "4") ||
        (element.class && element.class === "5")
      ) {
        countPge = countPge + 1;
        this.countPge = countPge;
      } else if (element.class && element.class === "0") {
        countEce = countEce + 1;
        this.countEce = countEce;
      }
    });
    this.totalCount = countPge + countEce;
  }

  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  openCallResponseReport() {
    this.route.navigate(["/callresponsereport"]);
  }

  //PGE or ECE STUDENT REGISTRATION

  showAction = [];
  student_list_bkp: any = [];

  async open_register_modal(studentObj, flag) {
    const modal = await this.modalCtrl.create({
      component: StudentregisterPage,
      componentProps: { res: { flag: flag, studentObj: studentObj } },
    });
    modal.onDidDismiss().then((data) => {
      this.getallstudents(this._userid);
    });
    return await modal.present();
  }

  async getallstudents(userid) {
    const studentcategory = "app";
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .getallstudentsbystudentcategory(userid, studentcategory)
      .subscribe(
        (res) => {
          this.getProgramCount(res);
          this.student_list = res;

          if (this.student_list == "") {
            // this.showAlert(this.msg_heading, "", this.msg);
          } else {
            this.student_list.forEach(function (value) {
              //   if (value.program == "pge" && value.baselinedetails.length == 3) {
              //     value.isAssessmentTaken = true;
              //   } else if (
              //     value.program == "ece" &&
              //     value.baselinedetails.length > 0
              //   ) {
              //     value.isAssessmentTaken = true;
              //   } else {
              //     value.isAssessmentTaken = false;
              //   }
            });
          }

          this.student_list_bkp = res;
          this.student_list.forEach((element) => {
            this.showAction[element.studentid] = false;
            element.hidden = true;
            element.english = {
              hidden: true,
              val: element.eng_level,
            };
            element.math = {
              hidden: true,
              val: element.math_level,
            };
            element.odia = {
              hidden: true,
              val: element.odia_level,
            };
            element.ece = {
              hidden: true,
              val: element.ec_level,
            };
          });
          loading.dismiss();
        },

        (err) => {
          this.errormessage = err;
          this.student_list = [];
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
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
          this.serverDownMsg.presentToast();
        }
      );
  }

  //slider image
  async getalldashboardslides() {
    await this.api.getalldashboardslides().subscribe(
      (res) => {
        if (res.length <= 0) {
          this.image_array = [];
        } else {
          this.image_array = res;

          this.image_array.forEach((element) => {
            if (element.title) {
              this.title_present = true;
            } else {
              this.title_present = false;
            }
          });
        }
      },
      (err) => {
        this.serverDownMsg.presentToast();
      }
    );
  }

  onSliderimageClick(type) {
    // console.log("clicked-->", type);
    if (type != null && type == "leaderboard") {
      this.route.navigate(["/leaderboard"]);
    } else if (type != null && type == "performance") {
      this.route.navigate(["/performance"]);
    } else {
    }
  }

  async getUserProfile() {
    await this.api.getuserbyuserid(this._userid).subscribe(
      (res) => {
        this.profile_data = res;
        if (this.profile_data.length > 0) {
          this._username = this.profile_data[0].username;
          this.profile_image = this.profile_data[0].image;
        }
      },
      (err) => {
        console.log("Unable to fetch profile");
        this.serverDownMsg.presentToast();
      }
    );
  }

  async openStudentRegisterbyType() {
    const modal = await this.modalCtrl.create({
      component: StudentregisterbytypePage,
      componentProps: {},
      cssClass: "transparent-modal",
    });
    return await modal.present();
  }

  // async openOptionSelection() {
  //   const modal = await this.modalController.create({
  //     component: EditprofilemodalPage,
  //     cssClass: "transparent-modal",
  //   });
  //   modal.onDidDismiss().then((res) => {
  //     // console.log(res);
  //     if (res.role !== "backdrop") {
  //       if (res.data === "Photos") {
  //         this.ChooseGallery();
  //       } else if (res.data === "Camera") {
  //         this.ChooseCamera();
  //       } else {
  //         this.image_preview = null;
  //       }
  //     }
  //   });
  //   return await modal.present();
  // }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: "bottom",
    });
    toast.present();
  }
}
