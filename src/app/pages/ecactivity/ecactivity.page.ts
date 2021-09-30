import { Component, NgZone } from "@angular/core";
import { GeneralInstructionsPage } from "../../general-instructions/general-instructions.page";
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

import { TranslateService } from "@ngx-translate/core";

import { EceselectclassmodalPage } from "../modal/eceselectclassmodal/eceselectclassmodal.page";
import { Ecactivity1Page } from "../ecactivity1/ecactivity1.page";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-ecactivity",
  templateUrl: "./ecactivity.page.html",
  styleUrls: ["./ecactivity.page.scss"],
})
export class EcactivityPage {
  program = "ece";
  subject = "na";
  month_list: any = [];
  week_list: any = [];
  activity_list: any = [];
  selected_month = "";
  selected_week = "";
  activity_heading = "";

  month_diff: number;
  userobj: any = {};
  userreg_date = "";

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  toolbarshadow = true;
  active_month_list = [];
  loading;
  activity_loaded = false;

  week1: string = "";
  week2: string = "";
  week3: string = "";
  week4: string = "";

  level: string = "";
  info_txt: string = "";
  select_lvl_alert: string = "";

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
    private translateService: TranslateService,
    private serverDownMsg: ServerDownService
  ) {
    //----- nrusingh 05-02-2020 - get language translate object value --------------
    this.week1 = this.translateService.get("ECEACTIVITY.week1")["value"];
    this.week2 = this.translateService.get("ECEACTIVITY.week2")["value"];
    this.week3 = this.translateService.get("ECEACTIVITY.week3")["value"];
    this.week4 = this.translateService.get("ECEACTIVITY.week4")["value"];
    this.info_txt = this.translateService.get("ECEACTIVITY.info")["value"];
    this.select_lvl_alert = this.translateService.get(
      "ECEACTIVITY.select_lvl_alert"
    )["value"];
    //-------------------------------------------------------------------------------

    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";

    this.getuserbyid(this._userid);
    this.generalInstructions();
    this.route.queryParams.subscribe((params) => {
      if (params && params.paramiters) {
        const qryParams = JSON.parse(params.paramiters);
        this.reloadActivityData(qryParams.month + " " + qryParams.week);
      }
    });
  }

  async getuserbyid(userid) {
    // const loading = await this.loadingController.create({
    //   spinner: null,
    // });
    // await loading.present();
    await this.api.getuserbyuserid(userid).subscribe(
      (res) => {
        res = res == undefined || res == null ? [] : res;
        if (res.length > 0) {
          this.userobj = res[0];
          this.userreg_date = res[0].createdon;
        }
        this.calculatemonth(new Date(this.userreg_date), new Date());
        // this.calculatemonth(new Date(2018,11,11), new Date(2019,5,7));
        // loading.dismiss();
      },
      (err) => {
        this.serverDownMsg.presentToast();
        // loading.dismiss();
      }
    );
  }

  calculatemonth(fromDate, toDate) {
    // month difference
    let months =
      toDate.getMonth() -
      fromDate.getMonth() +
      12 * (toDate.getFullYear() - fromDate.getFullYear()) +
      1;
    if (toDate.getDate() < fromDate.getDate()) {
      months--;
    }
    this.month_diff = months;

    // make month_diff a +ve number
    this.month_diff =
      this.month_diff < 0 ? this.month_diff * -1 : this.month_diff;
    let obj = {};
    this.month_list = [];
    /* 
    // commented by nrusingh on 15-01-2020 as there is change in requirement. Now all 10 month buttons are active
    for (let i = 1; i <= 12; i++) {
      if ( i <= this.month_diff) {
        obj = { value: '' + i, text: 'Month ' + i, disabled: false};
        this.active_month_list.push({name: 'Month ' + i, value: i, selected: false});
      } else {
        obj = { value: '' + i, text: 'Month ' + i, disabled: true};
      }
      this.month_list.push(obj);
    }
    */
    for (let i = 1; i <= 10; i++) {
      obj = { value: "" + i, text: "Month " + i, disabled: false };
      this.active_month_list.push({
        name: "Month " + i,
        value: i,
        selected: false,
      });
      this.month_list.push(obj);
    }
  }

  levelOnChange(level) {
    level = this.level;
  }

  // month on change event
  month_onchange(value) {
    this.active_month_list.forEach((element) => {
      element.selected = false;
    });
    this.active_month_list[value - 1].selected = true;

    this.selected_month = value;
    let obj = {};
    this.week_list = [];
    for (let i = 1; i <= 4; i++) {
      obj = { value: "" + i, text: "Week " + i };
      this.week_list.push(obj);
    }

    if (this.selected_month !== "" && this.selected_week !== "") {
      this.getactivitydetails(this.selected_month, this.selected_week);
    }
  }

  async select_skill(mnth) {
    if (this.level == "") {
      this.showAlert(this.info_txt, "", this.select_lvl_alert);
    } else {
      const alert = await this.alertController.create({
        header: "Select Skill",
        inputs: [
          {
            type: "radio",
            label: this.week1,
            value: "physical",
          },
          {
            type: "radio",
            label: this.week2,
            value: "memory",
          },
          {
            type: "radio",
            label: this.week3,
            value: "social&emotional",
          },
          {
            type: "radio",
            label: this.week4,
            value: "language",
          },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {},
          },
          {
            text: "Ok",
            handler: (data) => {
              const parameters = {
                preferedlanguage: localStorage.getItem("_language"),
                userid: this._userid,
                program: this.program,
                subject: this.subject,
                level: this.level,
                month: mnth,
                skill: data,
              };
              console.log("--> parameters: ", parameters);

              const navigationExtras: NavigationExtras = {
                queryParams: {
                  paramiters: JSON.stringify(parameters),
                },
              };
              this.router.navigate(["pgeactivitycontents"], navigationExtras);
            },
          },
        ],
      });
      await alert.present();
    }
  }

  async openSelectModal(month, week) {
    const modal = await this.modalController.create({
      component: EceselectclassmodalPage,
      componentProps: { res: { month: month, week: week } },
      cssClass: "half-modal",
    });
    return await modal.present();
  }

  week_onchange(value) {
    this.selected_week = value;
    if (this.selected_month !== "" && this.selected_week !== "") {
      this.getactivitydetails(this.selected_month, this.selected_week);
    }
  }

  async reloadActivityData(monthAndWeek: string) {
    const mnw = monthAndWeek.split(" ");
    this.getactivitydetails(mnw[0], mnw[1]);
  }

  async getactivitydetails(month, week) {
    this.selected_month = month;
    this.selected_week = week;
    this.activity_heading =
      "Month(" + this.selected_month + ") - Week(" + this.selected_week + ")";
    // this.loading = await this.loadingController.create({
    //   spinner: null,
    // });
    // await this.loading.present();
    let preferedlanguage = localStorage.getItem("_language");
    await this.api
      .getmasteractivities(
        preferedlanguage,
        this.program,
        this.subject,
        this.selected_month,
        this.selected_week
      )
      .subscribe(
        (res) => {
          this.setActivityStatus(res);
          // this.loading.dismiss();
        },
        (err) => {
          // this.loading.dismiss();
          this.serverDownMsg.presentToast();
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
          });
          // this.loading.dismiss();
        },
        (err) => {
          // this.loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  // ece fillmarks button click
  async activity_btnclick(activity) {
    // navigate forward with params
    const paramiters = {
      program: this.program,
      subject: this.subject,
      month: this.selected_month,
      week: this.selected_week,
      activity: activity,
    };
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify(paramiters),
      },
    };
    // this.navController.navigateForward('/ecactivity2', navigationExtras);
    this.router.navigate(["ecactivity2"], navigationExtras);
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
  refresh() {
    // this.router.navigate(['/'])
    // .then(() => {
    //   window.location.reload();
    // });
  }

  async generalInstructions() {
    const modal = await this.modalController.create({
      component: GeneralInstructionsPage,
      // cssClass: "my-modal",
    });
    await modal.present();
    modal.onDidDismiss().then((data) => {});
  }
}
