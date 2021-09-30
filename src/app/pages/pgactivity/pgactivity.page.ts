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
import { RestApiService } from "./../../rest-api.service";
import { TranslateService } from "@ngx-translate/core";
import { color } from "highcharts";
import { GeneralInstructionsPgePage } from "../../general-instructions-pge/general-instructions-pge.page";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-pgactivity",
  templateUrl: "./pgactivity.page.html",
  styleUrls: ["./pgactivity.page.scss"],
})
export class PgactivityPage {
  program = "pge";
  // subject: string = 'na';
  month_list: any = [];
  week_list: any = [];
  activity_list: any = [];
  myArray: any = [];
  selected_level: string = "1";
  selected_month = "";
  selected_week = "";
  selected_subject = "math";
  activity_heading = "";
  totaldata: any;
  Weekcomplete: boolean = false;

  month_diff: number;
  userobj: any = {};
  userreg_date = "";

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  toolbarshadow = true;
  activity_loaded = false;

  preferedlanguage: string = localStorage.getItem("_language");
  skill1_4: string = "";
  skill5_8: string = "";
  skill9_12: string = "";
  skill13_16: string = "";
  skill17_20: string = "";

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    private translateService: TranslateService,
    public api: RestApiService,
    private modelctrl: ModalController,
    private loadingController: LoadingController,
    private router: Router,
    private serverDownMsg: ServerDownService
  ) {
    this.selected_level = "1";
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";

    this.skill1_4 = this.translateService.get("PGEACTIVITY.skill1_4")["value"];
    this.skill5_8 = this.translateService.get("PGEACTIVITY.skill5_8")["value"];
    this.skill9_12 = this.translateService.get("PGEACTIVITY.skill9_12")[
      "value"
    ];
    this.skill13_16 = this.translateService.get("PGEACTIVITY.skill13_16")[
      "value"
    ];
    this.skill17_20 = this.translateService.get("PGEACTIVITY.skill17_20")[
      "value"
    ];

    this.pageload();
    this.getTchActivity1();
    this.generalInstructions();
    this.getWeekCompleteLevel();
  }

  pageload() {
    // this.month_list = [
    //   { value: '1', text: this.skill1_4, disabled: false, subject: 'math', iscompleted: false },
    //   { value: '2', text: this.skill5_8, disabled: false, subject: 'math', iscompleted: false },
    //   { value: '3', text: this.skill9_12, disabled: false, subject: 'math', iscompleted: false },
    //   { value: '4', text: this.skill13_16, disabled: false, subject: 'math', iscompleted: false },
    //   { value: '5', text: this.skill17_20, disabled: false, subject: 'math', iscompleted: false },
    // ];
  }

  async getWeekCompleteLevel() {
    await this.api
      .gettchassessmentbylevel(
        this._userid,
        "en",
        "pge",
        this.selected_level,
        this.selected_month,
        this.selected_subject
      )
      .subscribe(
        (res) => {
          var month_list = [
            {
              value: "1",
              text: this.skill1_4,
              disabled: false,
              subject: this.selected_subject,
              iscompleted: false,
            },
            {
              value: "2",
              text: this.skill5_8,
              disabled: false,
              subject: this.selected_subject,
              iscompleted: false,
            },
            {
              value: "3",
              text: this.skill9_12,
              disabled: false,
              subject: this.selected_subject,
              iscompleted: false,
            },
            {
              value: "4",
              text: this.skill13_16,
              disabled: false,
              subject: this.selected_subject,
              iscompleted: false,
            },
            {
              value: "5",
              text: this.skill17_20,
              disabled: false,
              subject: this.selected_subject,
              iscompleted: false,
            },
          ];

          for (var i = 0; i < month_list.length; i++) {
            var month_data = res.find((r) => r.month == month_list[i].value);
            if (month_data) month_list[i].iscompleted = month_data.iscompleted;
            else month_list[i].iscompleted = false;
          }

          this.month_list = month_list;
        },
        (err) => {
          this.serverDownMsg.presentToast();
        }
      );
  }

  async getTchActivity1() {
    var data = {
      userid: this._userid,
      program: this.program,
      subject: this.selected_subject,
      month: this.selected_month,
      activity: this.selected_level,
    };
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.gettchactivitiydetails1(data).subscribe(
      (res) => {
        this.totaldata = res;
        var months = ["month1", "month2", "month3", "month4", "month5"];

        for (var m = 0; m < months.length; m++) {
          var weeks = ["week1", "week2", "week3", "week4"];
          this.Weekcomplete = false;
          for (var w = 0; w < weeks.length; w++) {
            var results = res.filter(
              (s) => s.month == months[m] && s.week == weeks[w]
            );

            if (results.length > 0) {
              this.Weekcomplete = true;
            }
            if (this.Weekcomplete) {
            }
          }
        }

        // this.Enable_CompleteActivityButton();
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  show_activity_details(monthAndWeek: string) {
    const mnw = monthAndWeek.split("$");
    this.selected_month = mnw[0];
    this.selected_week = mnw[1];
    this.selected_level = mnw[2];
    const paramiters = {
      program: this.program,
      subject: this.selected_subject,
      month: this.selected_month,
      week: this.selected_week,
      activity: this.selected_level,
    };
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify(paramiters),
      },
    };
    this.router.navigate(["ecactivity2"], navigationExtras);
  }

  /*
  month_onchange(value) {
    this.selected_month = value;
    let obj = {};
    this.week_list = [];
    for (let i = 1; i <= 4; i++) {
      obj = { value: '' + i, text: 'Week ' + i };
      this.week_list.push(obj);
    }
    if (this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0) {
      //this.getactivitydetails(this.selected_month, this.selected_week);
      this.show_activity_details(null);
    }
  }

  week_onchange(value) {
    this.selected_week = value;
    if (this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0) {
      //this.getactivitydetails(this.selected_month, this.selected_week);
      this.show_activity_details(null);
    }
  }

  async reloadActivityData(monthAndWeek: string) {
    const mnw = monthAndWeek.split('$');
    this.selected_month = mnw[0];
    this.selected_week = mnw[1];
    this.selected_level = mnw[2];
    this.getactivitydetails(mnw[0], mnw[1]);
  }

  async activity_btnclick(activity) {
    // navigate forward with params
    const paramiters = {
      program: this.program,
      subject: this.selected_subject,
      month: this.selected_month,
      week: this.selected_week,
      activity: this.selected_level//activity
    };
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify(paramiters)
      }
    };
    // this.navController.navigateForward('/pgactivity2', navigationExtras);
    // this.router.navigate(['pgactivity2'], navigationExtras);
    this.router.navigate(['ecactivity2'], navigationExtras);
  }

  async getactivitydetails(month, week) {
    this.selected_month = month;
    this.selected_week = week;

    this.activity_heading = 'Month(' + this.selected_month + ') - Week(' + this.selected_week + ')';

    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getmasteractivities(this.preferedlanguage, this.program, this.selected_subject, this.selected_month, this.selected_week).subscribe(res => {
      loading.dismiss();
      this.setActivityStatus(res);
    }, err => {
      loading.dismiss();
    });
  }

  async setActivityStatus(all_activities) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.gettchactivitybyuser(
      this._userid,
      this.program,
      this.selected_subject,
      this.selected_month,
      this.selected_week
    ).subscribe(res => {
      this.activity_list = [];
      this.activity_loaded = true;
      all_activities.forEach(element => {
        let obj = {};
        if (res.includes(element)) {
          obj = { val: element, cls: 'success' };
        } else {
          obj = { val: element, cls: 'warning' };
        }
        this.activity_list.push(obj);
        // this.myArray = this.activity_list;
        this.activity_list.sort((a, b) => a.val - b.val);
      });
      loading.dismiss();
    }, err => {
      loading.dismiss();
    });
  }
  
  sortNumber(a, b) {
    return a - b;
  }
  */
  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }

  async generalInstructions() {
    const modal = await this.modelctrl.create({
      component: GeneralInstructionsPgePage,
      //cssClass: "my-modal",
    });
    await modal.present();
    modal.onDidDismiss().then((data) => {});
  }
}
