import { Component, ViewChild, ViewChildren, QueryList } from "@angular/core";
import {
  Platform,
  NavController,
  IonRouterOutlet,
  AlertController,
  LoadingController,
  ModalController,
  PopoverController,
  Events,
} from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { FCM } from "@ionic-native/fcm/ngx";
import { environment } from "src/environments/environment.prod";
import { RestApiService } from "./rest-api.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { Router, NavigationExtras } from "@angular/router";
// market
import { Market } from "@ionic-native/market/ngx";

// offline
import { NetworkService, ConnectionStatus } from "./services/network.service";
import { OfflineManagerService } from "./services/offline-manager.service";

import { SyncappPage } from "./pages/modal/syncapp/syncapp.page";

const version = environment.version;
const envpackage = environment.package;

// User profile Image service
import { UserprofileimageService } from "./services/userprofileimage.service";

// Transalte
import { TranslateConfigService } from "./translate-config.service";

// Google Signin
import { GooglePlus } from "@ionic-native/google-plus/ngx";

import { UpdatepagePage } from "./updatepage/updatepage.page";
import { ServerDownService } from "./services/server-down.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  app_package: string = "";
  app_version: string = "";
  selectedLanguage: string;
  _userid: string;
  _username: string;
  _emailid: string;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  user_image: string =
    "./../../../../assets/img/default-user-profile-image.png"; // default user image
  user_unread_message: string = "/assets/img/default-user-profile-image.png"; // default user image

  runningTime: any;
  appStartTime: any;
  appEndTime: any;
  timeSpent: any = 0;
  timeSpend: any = 0;
  sumOfTimeSpent = 0;
  inForeground: boolean;
  inBackground: boolean;
  toolbarshadow = true;

  // @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  hide_update_button: boolean;
  profile_image: string;
  profile_data: any;

  constructor(
    public navController: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private screenOrientation: ScreenOrientation,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private router: Router,
    private fcm: FCM,
    private api: RestApiService,
    private translateConfigService: TranslateConfigService,
    private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private market: Market,
    public googlePlus: GooglePlus,
    private userprofileimageService: UserprofileimageService,
    public popoverCtrl: PopoverController,
    private serverDownMsg: ServerDownService
  ) {
    this.app_version = version;
    this.app_package = envpackage;
    this.check_for_updates(this.app_package, this.app_version);
    this.backButtonEvent();

    // translate get language
    if (
      localStorage.getItem("_language") == undefined ||
      localStorage.getItem("_language") == null ||
      localStorage.getItem("_language") == ""
    ) {
      //this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
      this.selectedLanguage = "od";
    } else {
      // this.selectedLanguage = localStorage.getItem('_language');
      this.selectedLanguage = "od";
    }
    this.languageChanged(this.selectedLanguage);
    this._userid = localStorage.getItem("_userid");
    this._emailid = localStorage.getItem("_emailid");
    if (this._userid == null) {
      //this.navCtrl.navigateRoot('/login');
      this.navCtrl.navigateRoot("/landing");
    }
    this.initializeApp();

    //------>>>Time Spent module commented because not required in app idle state<<<------
    // this.appStartTime = new Date().getTime();
    // this.timeSpend = parseInt(localStorage.getItem("_timeSpent"));
    // this.timeSpend = localStorage.getItem("_timeSpent");
    // this.timeReset();
    // this.checkAppRunning();
    // this.timeCalcIfBg_Fg();
  }

  ngOnInit() {
    // this._userid = localStorage.getItem("_userid");
    // this.profile_image = localStorage.getItem("_profile_image");
    // this._username = localStorage.getItem("_username");
    // this.getUserProfile();
  }

  // translate set language
  languageChanged(value) {
    this.selectedLanguage = value;
    this.translateConfigService.setLanguage(this.selectedLanguage);
    localStorage.setItem("_language", this.selectedLanguage);

    this.router.navigate(["/home-results"]);
    // this.router.navigate(['/landing']);
  }

  initializeApp() {
    this.platform
      .ready()
      .then(() => {
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString("#4286f4");
        this.splashScreen.hide();

        // offline
        this.networkService
          .onNetworkChange()
          .subscribe((status: ConnectionStatus) => {
            if (status === ConnectionStatus.Online) {
              this.offlineManager.checkForEvents().subscribe();
            }
          });

        // Push notification starts from here
        this.fcm.getToken().then((token) => {
          console.log("1.app get FCM Token: " + token);
          localStorage.setItem("fcm_token", token);
        });

        this.fcm.onTokenRefresh().subscribe((token) => {
          console.log("2.app get FCM RToken: " + token);
          localStorage.setItem("fcm_rtoken", token);
        });

        this.fcm.onNotification().subscribe((data) => {
          if (data.wasTapped) {
            this.router.navigate(["/showpushnotification", data.message]);
          } else {
            this.router.navigate(["/showpushnotification", data.message]);
          }
        });
      })
      .catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward("edit-profile");
  }

  // for syncing full app for full offline browse
  async sync_app() {
    const modal = await this.modalController.create({
      component: SyncappPage,
      componentProps: { res: { userid: this._userid } },
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();

    /*
    await this.api.setcheckouttime(id, time).subscribe(res => {
        loading.dismiss();
      }, err => {
        loading.dismiss();
      });
    */
  }

  logout() {
    //this.setCheckoutTime();
    localStorage.clear();
    localStorage.setItem("_language", this.selectedLanguage);
    this.signoutGoogle();
    this.navCtrl.navigateRoot("/login");
    // console.log("App compo local->", localStorage);
  }

  signoutGoogle() {
    this.googlePlus
      .logout()
      .then((res) => {
        // console.log("Logout success: ", res);
      })
      .catch((err) => {
        console.log("Logout Error", err);
      });
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else {
        //------>>>Time Spent module commented because not required in app idle state<<<------
        // this.appEndTime = new Date().getTime();
        // this.timeDiffCalc(this.appStartTime, this.appEndTime);
        // localStorage.setItem("_timeSpent", this.sumOfTimeSpent.toString());
        this.exitTheApp(this.router.url);
      }
    });
  }

  async exitTheApp(url) {
    const alert = await this.alertController.create({
      header: "Exit",
      subHeader: "",
      message: "Are you Sure?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Ok",
          handler: () => {
            navigator["app"].exitApp();
          },
        },
      ],
    });
    await alert.present();
  }

  async setCheckoutTime() {
    const id = localStorage.getItem("_document_id");
    const time = new Date();
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.setcheckouttime(id, time).subscribe(
      (res) => {
        localStorage.removeItem("_document_id");
        loading.dismiss();
      },
      (err) => {
        localStorage.removeItem("_document_id");
        loading.dismiss();
        // this.serverDownMsg.presentToast();
      }
    );
  }

  async check_for_updates(app_package, app_version) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();

    await this.api.getappversion(app_package).subscribe(
      (res) => {
        if (res != undefined && res != null && res.length > 0) {
          let available_version = res[0]["version"];
          let app_v = parseInt(app_version.trim().replace(/\./g, ""));
          let available_v = parseInt(
            available_version.trim().replace(/\./g, "")
          );
          if (app_v < available_v) {
            this.check_for_update();
            this.hide_update_button = false;
          } else {
          }
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        // this.serverDownMsg.presentToast();
      }
    );
  }

  async update_button_click() {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();

    await this.api.getappversion(this.app_package).subscribe(
      (res) => {
        if (res != undefined && res != null && res.length > 0) {
          let available_version = res[0]["version"];
          let app_v = parseInt(this.app_version.trim().replace(/\./g, ""));
          let available_v = parseInt(
            available_version.trim().replace(/\./g, "")
          );
          if (app_v < available_v) {
            this.market.open(this.app_package);
          } else {
            // this.showAlert(
            //   "No Updates Available",
            //   "",
            //   " App Already Up to Date"
            // );
          }
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        // this.serverDownMsg.presentToast();
      }
    );
  }

  async check_for_update() {
    const popover = await this.popoverCtrl.create({
      component: UpdatepagePage,
      animated: true,
      backdropDismiss: true,
      cssClass: "contact-popover",
    });
    return await popover.present();
  }

  // alert box
  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      backdropDismiss: false, //<-- to disable closing alert when clicking outside
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.alertController.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  //profile Image
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
        // this.serverDownMsg.presentToast();
      }
    );
  }

  // calculate_time_of_use() {
  //   let _login_time = localStorage.getItem("_login_time");
  //   _login_time =
  //     typeof _login_time !== "undefined"
  //       ? _login_time
  //       : "2014-01-01 01:02:03.123456";

  //   let login_time = new Date(_login_time).getTime();
  //   let logout_time = new Date().getTime();
  //   let diff_milisec = 0;
  //   let diff_day = 0;

  //   if (isNaN(login_time)) {
  //     return "";
  //   }

  //   if (login_time < logout_time) {
  //     diff_milisec = logout_time - login_time;
  //   } else {
  //     diff_milisec = login_time - logout_time;
  //   }

  //   diff_day = Math.floor(diff_milisec / 1000 / 60 / (60 * 24));

  //   let date_diff = new Date(diff_milisec);
  //   let diff_str =
  //     diff_day +
  //     " Days " +
  //     date_diff.getHours() +
  //     " Hours " +
  //     date_diff.getMinutes() +
  //     " Minutes " +
  //     date_diff.getSeconds() +
  //     " Seconds";
  //   console.log(diff_str);
  // }

  //------>>>Time Spent module commented because not required in app idle state<<<------

  // ------>>>check app running in background or foreground<<<------
  // async checkAppRunning() {
  //   await this.platform.ready();

  //   if (this.platform.is("cordova")) {
  //     this.setPlatformListener();
  //   }
  // }

  // setPlatformListener() {
  //   this.platform.pause.subscribe(() => {
  //     // background
  //     // this.inBackground = true;
  //     // this.inForeground = false;
  //     this.appEndTime = new Date().getTime();
  //     this.timeDiffCalc(this.appStartTime, this.appEndTime);
  //     localStorage.setItem("_timeSpent", this.timeSpent);
  //   });

  //   this.platform.resume.subscribe(() => {
  //     // foreground
  //     // this.inBackground = false;
  //     // this.inForeground = true;
  //     this.appStartTime = new Date().getTime();
  //     this.timeSpend = localStorage.getItem("_timeSpent");
  //   });
  // }

  // ------>>>Time Spent functionality<<<------
  // timeReset() {
  //   if (this.timeSpend === null) {
  //     // alert(`timeReset called`);
  //     localStorage.setItem("_timeSpent", this.timeSpent);
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

  //   // this.sumOfTimeSpent = this.timeSpent + this.timeSpend;
  //   // return this.sumOfTimeSpent;
  // }
}
