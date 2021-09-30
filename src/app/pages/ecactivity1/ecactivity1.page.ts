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
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { RestApiService } from "./../../rest-api.service";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-ecactivity1",
  templateUrl: "./ecactivity1.page.html",
  styleUrls: ["./ecactivity1.page.scss"],
})
export class Ecactivity1Page {
  program = "ece";
  subject = "na";
  activity_list: any = [];
  selected_month = "";
  selected_week = "";
  activity_heading = "";

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  toolbarshadow = true;
  active_month_list = [];
  loading;
  activity_loaded = false;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private serverDownMsg: ServerDownService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";

    this.route.queryParams.subscribe((params) => {
      if (params && params.paramiters) {
        const qryParams = JSON.parse(params.paramiters);
        this.selected_month = qryParams.month;
        this.selected_week = qryParams.week;
        this.getactivitydetails(qryParams.month, qryParams.week);
        console.log(this.selected_month, this.selected_week);
      }
    });
  }

  async getactivitydetails(month, week) {
    this.loading = await this.loadingController.create({
      spinner: "dots",
      duration: 5000,
    });
    await this.loading.present();
    let preferedlanguage = localStorage.getItem("_language");
    await this.api
      .getmasteractivities(
        preferedlanguage,
        this.program,
        this.subject,
        month,
        week
      )
      .subscribe(
        (res) => {
          this.setActivityStatus(res);
          this.loading.dismiss();
        },
        (err) => {
          this.loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  async setActivityStatus(all_activities) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .gettchactivitybyuser(
        this._userid,
        this.program,
        this.subject,
        this.selected_month,
        this.selected_week
      )
      .subscribe(
        (res) => {
          this.activity_list = [];
          this.activity_loaded = true;
          all_activities.forEach((element) => {
            let obj = {};
            if (res.includes(element)) {
              obj = { val: element, cls: "success" };
            } else {
              obj = { val: element, cls: "warning" };
            }
            this.activity_list.push(obj);
          });
          this.loading.dismiss();
        },
        (err) => {
          this.loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  // Old method
  /*async activity_btnclick(activity) {
    const paramiters = {
      program: this.program,
      subject: this.subject,
      month: this.selected_month,
      week: this.selected_week,
      activity: activity
    };
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify(paramiters)
      }
    };
    this.router.navigate(['ecactivity2'], navigationExtras);
  }*/

  // New Method: Card Layout
  async activity_btnclick(activity) {
    let preferedlanguage = localStorage.getItem("_language");
    const paramiters = {
      preferedlanguage: preferedlanguage,
      userid: this._userid,
      program: this.program,
      subject: this.subject,
      level: activity,
      month: this.selected_month,
      skill: this.selected_week,
    };
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify(paramiters),
      },
    };
    this.router.navigate(["pgeactivitycontents"], navigationExtras);
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

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
}
