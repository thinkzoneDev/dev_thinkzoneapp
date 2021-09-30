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
import { GeneralInstructionsPgePage } from "../../general-instructions-pge/general-instructions-pge.page";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-pgeodiaactivity",
  templateUrl: "./pgeodiaactivity.page.html",
  styleUrls: ["./pgeodiaactivity.page.scss"],
})
export class PgeodiaactivityPage {
  //default variables
  preferedlanguage: string = localStorage.getItem("_language");
  userid: string = localStorage.getItem("_userid");
  program: string = "pge";
  subject: string = "odia";
  level: string = "1";
  month: string = "";
  skill: string = "";
  toolbarshadow = true;

  skill_list: any = [];

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private modelctrl: ModalController,
    private router: Router,
    public loadingController: LoadingController,
    private serverDownMsg: ServerDownService
  ) {
    // open general instruction modal
    this.generalInstructions();
    // this.setdefault();
    this.getskills(
      this.preferedlanguage,
      this.program,
      this.subject,
      this.level
    );
  }

  async generalInstructions() {
    const modal = await this.modelctrl.create({
      component: GeneralInstructionsPgePage,
    });
    await modal.present();
    modal.onDidDismiss().then((data) => {});
  }

  setdefault() {
    this.preferedlanguage =
      localStorage.getItem("_language") == undefined ||
      localStorage.getItem("_language") == null ||
      localStorage.getItem("_language") == ""
        ? "en"
        : localStorage.getItem("_language");
    this.userid =
      localStorage.getItem("_userid") == undefined ||
      localStorage.getItem("_userid") == null ||
      localStorage.getItem("_userid") == ""
        ? ""
        : localStorage.getItem("_userid");
    this.program =
      this.program == undefined || this.program == null || this.program == ""
        ? "pge"
        : this.program;
    this.subject =
      this.subject == undefined || this.subject == null || this.subject == ""
        ? "math"
        : this.subject;
    this.level =
      this.level == undefined || this.level == null || this.level == ""
        ? "1"
        : this.level;
    this.month =
      this.month == undefined || this.month == null || this.month == ""
        ? ""
        : this.month;
  }

  // level on change
  level_change(level) {
    this.level = level;
    this.getskills(
      this.preferedlanguage,
      this.program,
      this.subject,
      this.level
    );
  }

  // month_onclick(month) {
  //   console.log("--> level: " + this.level + "    --> month: " + month);
  //   this.month = month;
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       paramiters: JSON.stringify({
  //         preferedlanguage: this.preferedlanguage,
  //         userid: this.userid,
  //         program: this.program,
  //         subject: this.subject,
  //         level: this.level,
  //         month: this.month,
  //       }),
  //     },
  //   };
  //   this.router.navigate(["pgeactivityskills"], navigationExtras);
  // }

  async skill_on_click(skill, index) {
    console.log("check skill", skill);

    this.skill = skill;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify({
          preferedlanguage: this.preferedlanguage,
          userid: this.userid,
          program: this.program,
          subject: this.subject,
          level: this.level,
          month: skill.skillsetid,
          skill: skill.skillsetid,
        }),
      },
    };
    this.router.navigate(["pgeactivitycontents"], navigationExtras);
  }

  async getskills(preferedlanguage, program, subject, level) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .getpgeactivityskill(preferedlanguage, program, subject, level)
      .subscribe(
        (res) => {
          console.log("--> res: " + JSON.stringify(res));
          this.skill_list = res;
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
    } else {
    }
  }
}
