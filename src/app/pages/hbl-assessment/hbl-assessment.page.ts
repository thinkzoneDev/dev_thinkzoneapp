import { Component, NgZone } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams,
} from "@ionic/angular";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { RestApiService } from "./../../rest-api.service";
import { TranslateService } from "@ngx-translate/core";

import { HblQuizPage } from "../hbl-quiz/hbl-quiz.page";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-hbl-assessment",
  templateUrl: "./hbl-assessment.page.html",
  styleUrls: ["./hbl-assessment.page.scss"],
})
export class HblAssessmentPage {
  language: string = "od";
  selected_month = "";
  assessment_btn_clicked = true;
  month_list: any[] = [];
  // preferedlanguage: string = localStorage.getItem("_language");
  res: any;
  docid: string;
  userid: string;
  username: string;
  studentid: string;
  studentname: string;
  program: string;
  class: string;
  gender: string;
  phone: number;
  school: string;
  parentsname: string;
  dob: string;

  isAssessmentTaken: boolean;
  baselnBtnHidden: boolean;
  eceAssessmentBtnHidden: boolean;
  pgeAssessmentBtnHidden: boolean;

  month_baselnAndEndln = "month0";
  month1: string = "";
  month2: string = "";
  month3: string = "";
  month4: string = "";
  month5: string = "";
  month6: string = "";
  month7: string = "";
  month8: string = "";
  month9: string = "";
  month10: string = "";
  month11: string = "";
  month12: string = "";

  msg_info: string = "";
  msg: string = "";
  msg_selectMonth: string = "";

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private serverDownMsg: ServerDownService
  ) {
    this.res = this.navParams.data.res;
    this.docid = this.res.docid;
    this.userid = this.res.userid;
    this.username = this.res.username;
    this.studentid = this.res.studentid;
    this.studentname = this.res.studentname;
    this.program = this.res.program;
    this.gender = this.res.gender;
    this.phone = this.res.phone;
    this.school = this.res.school;
    this.parentsname = this.res.parentsname;
    this.dob = this.res.dob;

    //translator variables
    this.msg_info = this.translateService.get("HBLASSESSMENT.msg_info")[
      "value"
    ];
    this.msg = this.translateService.get("HBLASSESSMENT.msg")["value"];
    this.msg_selectMonth = this.translateService.get(
      "HBLASSESSMENT.msg_selectMonth"
    )["value"];

    this.month1 = this.translateService.get("HBLASSESSMENT.month1")["value"];
    this.month2 = this.translateService.get("HBLASSESSMENT.month2")["value"];
    this.month3 = this.translateService.get("HBLASSESSMENT.month3")["value"];
    this.month4 = this.translateService.get("HBLASSESSMENT.month4")["value"];
    this.month5 = this.translateService.get("HBLASSESSMENT.month5")["value"];
    this.month6 = this.translateService.get("HBLASSESSMENT.month6")["value"];
    this.month7 = this.translateService.get("HBLASSESSMENT.month7")["value"];
    this.month8 = this.translateService.get("HBLASSESSMENT.month8")["value"];
    this.month9 = this.translateService.get("HBLASSESSMENT.month9")["value"];
    this.month10 = this.translateService.get("HBLASSESSMENT.month10")["value"];
    this.month11 = this.translateService.get("HBLASSESSMENT.month11")["value"];
    this.month12 = this.translateService.get("HBLASSESSMENT.month12")["value"];

    this.set_month_list();
    this.checkProgram();
    this.setClass();
    this.checkBaselineStatus();

    console.log("navparams data", this.res);
  }

  set_month_list() {
    this.month_list = [
      { value: "month1", text: this.month1, disabled: false },
      { value: "month2", text: this.month2, disabled: false },
      { value: "month3", text: this.month3, disabled: false },
      { value: "month4", text: this.month4, disabled: false },
      { value: "month5", text: this.month5, disabled: false },
      { value: "month6", text: this.month6, disabled: false },
      { value: "month7", text: this.month7, disabled: false },
      { value: "month8", text: this.month8, disabled: false },
      { value: "month9", text: this.month9, disabled: false },
      { value: "month10", text: this.month10, disabled: false },
      { value: "month11", text: this.month11, disabled: false },
      { value: "month12", text: this.month12, disabled: false },
    ];
  }

  //month on change event
  month_onchange(value) {
    this.selected_month = value;
    if (this.selected_month.length > 0) {
      this.assessment_btn_clicked = false;
    } else {
      this.assessment_btn_clicked = true;
    }
  }

  async checkProgram() {
    if (this.program == "ece") {
      this.eceAssessmentBtnHidden = false;
      this.pgeAssessmentBtnHidden = true;
    } else {
      this.eceAssessmentBtnHidden = true;
      this.pgeAssessmentBtnHidden = false;
    }
  }

  setClass() {
    if (this.program == "ece") {
      this.class = "0";
    } else {
      this.class = this.res.class;
    }
  }

  async checkBaselineStatus() {
    let studentid = this.studentid;
    let selected_class = this.class;
    let month = this.month_baselnAndEndln;
    let selected_subject = "baseline";

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .gethblassessment(studentid, selected_class, month, selected_subject)
      .subscribe(
        (res) => {
          if (Object.keys(res).length > 0) {
            this.baselnBtnHidden = true;
          } else {
            //do something
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  async baselnAndEndln_btnclick(subject) {
    let studentid = this.studentid;
    let selected_class = this.class;
    let month = this.month_baselnAndEndln;
    let selected_subject = "";

    if (subject === "baseln") {
      selected_subject = "baseline";
    } else if (subject === "endln") {
      selected_subject = "endline";
    }

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .gethblassessment(studentid, selected_class, month, selected_subject)
      .subscribe(
        (res) => {
          if (Object.keys(res).length > 0) {
            this.showAlert(this.msg_info, "", this.msg);
          } else {
            this.open_quiz(selected_subject, month);
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  async assessment_btnclick(subject) {
    let studentid = this.studentid;
    let selected_class = this.class;
    let month = this.selected_month;
    let selected_subject = "";

    if (this.assessment_btn_clicked) {
      this.showAlert(this.msg_info, "", this.msg_selectMonth);
      return;
    }

    if (subject === "eceAct") {
      selected_subject = "eceActivity";
    } else if (subject === "eng") {
      selected_subject = "english";
    } else if (subject === "math") {
      selected_subject = "math";
    } else if (subject === "odia") {
      selected_subject = "odia";
    } else if (subject === "ases") {
      selected_subject = "assesment";
    }

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .gethblassessment(studentid, selected_class, month, selected_subject)
      .subscribe(
        (res) => {
          if (Object.keys(res).length > 0) {
            this.showAlert(this.msg_info, "", this.msg);
          } else {
            this.open_quiz(selected_subject, month);
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  async open_quiz(subject, month) {
    const modal = await this.modalController.create({
      component: HblQuizPage,
      componentProps: {
        res: {
          docid: this.docid,
          userid: this.userid,
          username: this.username,
          studentid: this.studentid,
          studentname: this.studentname,
          class: this.class,
          month: month,
          subject: subject,
          gender: this.gender,
          phone: this.phone,
          school: this.school,
          parentsname: this.parentsname,
          dob: this.dob,
        },
      },
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
      buttons: ["ok"],
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
          handler: (blah) => {
            // console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Ok",
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  //Close modal
  closeModal() {
    this.modalController.dismiss();
  }
}
