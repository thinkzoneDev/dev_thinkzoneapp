import { Component, OnInit } from "@angular/core";
import { NavParams } from "@ionic/angular";
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
import { RestApiService } from "../../../rest-api.service";
@Component({
  selector: "app-eceselectclassmodal",
  templateUrl: "./eceselectclassmodal.page.html",
  styleUrls: ["./eceselectclassmodal.page.scss"],
})
export class EceselectclassmodalPage implements OnInit {
  res: any;
  program = "ece";
  subject = "na";
  activity_list: any = [];
  selected_month: any;
  selected_week: any;
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
    public navParams: NavParams,
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";
    this.res = this.navParams.data.res;
    this.res = console.log("12345 ->", this.res);

    if (this.res) {
      const response = JSON.parse(this.res);
      this.selected_month = response.month;
      this.selected_week = response.week;
      this.getactivitydetails(response.month, response.week);
    }
  }

  ngOnInit() {}

  async getactivitydetails(month, week) {
    this.loading = await this.loadingController.create({ spinner: "dots" });
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
          // loading.dismiss();
          this.setActivityStatus(res);
        },
        (err) => {
          this.loading.dismiss();
        }
      );
  }

  async setActivityStatus(all_activities) {
    // const loading = await this.loadingController.create({});
    // await loading.present();
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
            console.log(this.activity_list);
          });
          this.loading.dismiss();
        },
        (err) => {
          this.loading.dismiss();
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
}
