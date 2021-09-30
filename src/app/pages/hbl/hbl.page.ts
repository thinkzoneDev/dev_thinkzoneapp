import { Component, NgZone } from "@angular/core";
import {
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { Router } from "@angular/router";
import { HblPopoverComponent } from "../hbl-popover/hbl-popover.component";
import { HblRegisterPage } from "../hbl-register/hbl-register.page";
import { HblAssessmentPage } from "../hbl-assessment/hbl-assessment.page";
import { CallresponsePage } from "../callresponse/callresponse.page";

import { TranslateService } from "@ngx-translate/core";
import { NavController, NavParams } from "@ionic/angular";
import { CallNumber } from "@ionic-native/call-number/ngx";

// api
import { RestApiService } from "./../../rest-api.service";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-hbl",
  templateUrl: "./hbl.page.html",
  styleUrls: ["./hbl.page.scss"],
})
export class HblPage {
  searchText: any = "";
  student_list: any = [];
  student_list_bkp: any = [];
  student_name = "";
  program = "";
  class: number;
  phone = 0;
  gender = "";
  dob = "";
  father = "";
  items: any = [];
  close = false;
  totalCount: any;
  student: any;
  selected_level = "";
  selected_ec_level = "";
  selected_math_level = "";
  selected_eng_level = "";
  selected_odia_level = "";

  isAssessmentTaken: boolean = false;
  assessmentTestRecords: any = [];
  res: any;
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  userid: string;
  usertype: string;
  passcode: string;
  program1: string = "";
  level: string = "";
  stage: string = "";
  subject = {};
  value: any;
  school_list: any = [];

  heading: string = "";
  msg: string = "";
  msg_heading: string = "";
  del_msg_heading: string = "";
  del_msg: string = "";
  del_msg1: string = "";
  del_msg2: string = "";
  popovr_msg: string = "";
  popovr_heading: string = "";
  import_msg1: string = "";
  import_msg2: string = "";
  edit_dlt_msg: string = "";
  edit_dlt_header: string = "";
  edit_btn: string = "";
  dlt_btn: string = "";

  toolbarshadow = true;
  levels = [1, 2, 3, 4, 5];
  ece_levels = [1, 2, 3];
  errormessage = "";
  displaystudent: any;
  countEce = 0;
  countPge = 0;
  showAction = [];
  num: number;
  showFillBtn: boolean = true;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private translateService: TranslateService,
    private router: Router,
    private callNumber: CallNumber,
    private serverDownMsg: ServerDownService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this.usertype = localStorage.getItem("_usertype");
    this.passcode = localStorage.getItem("_passcode");
    this._centerid = "";
    this._centername = "";
    this.getallstudents(this._userid);
    this.getAllSchools();

    this.res = "";
    this.userid = this._userid;
    this.subject = { subject: ' ["math", "english", "odia"]' };

    //translator variables
    this.heading = this.translateService.get("HBL.heading")["value"];
    this.msg = this.translateService.get("HBL.msg")["value"];
    this.msg_heading = this.translateService.get("HBL.msg_heading")["value"];
    this.popovr_heading =
      this.translateService.get("HBL.popovr_heading")["value"];
    this.popovr_msg = this.translateService.get("HBL.popovr_msg")["value"];
    this.import_msg1 = this.translateService.get("HBL.import_msg1")["value"];
    this.import_msg2 = this.translateService.get("HBL.import_msg2")["value"];
    this.del_msg_heading = this.translateService.get("EXPLORE.del_msg_heading")[
      "value"
    ];
    this.del_msg = this.translateService.get("EXPLORE.del_msg")["value"];
    this.del_msg1 = this.translateService.get("EXPLORE.del_msg1")["value"];
    this.del_msg2 = this.translateService.get("EXPLORE.del_msg2")["value"];
    this.edit_dlt_header = this.translateService.get("HBL.edit_dlt_header")[
      "value"
    ];
    this.edit_dlt_msg = this.translateService.get("HBL.edit_dlt_msg")["value"];
    this.edit_btn = this.translateService.get("HBL.edit_btn")["value"];
    this.dlt_btn = this.translateService.get("HBL.dlt_btn")["value"];
  }

  async getallstudents(userid) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getallstudents(userid).subscribe(
      async (res) => {
        console.log("student list", res);

        this.getProgramCount(res);
        this.student_list = res;
        this.student_list_bkp = res;
        loading.dismiss();
        if (this.student_list == "") {
          this.showAlert(this.msg_heading, "", this.msg);
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

  async getAllSchools() {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getallschools().subscribe(
      (res) => {
        this.school_list = res;
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  getProgramCount(res) {
    let countPge = 0;
    let countEce = 0;
    res.forEach((element) => {
      if (element.program && element.program === "pge") {
        countPge = countPge + 1;
        this.countPge = countPge;
      } else if (element.program && element.program === "ece") {
        countEce = countEce + 1;
        this.countEce = countEce;
      }
    });
    this.totalCount = countPge + countEce;
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }

  search_student(event) {
    this.searchText = event.target.value;
    if (
      this.searchText != null &&
      this.searchText != undefined &&
      this.searchText.length >= 0
    ) {
      let arr1 = this.student_list_bkp.filter((item) => {
        return item.studentname
          .toLowerCase()
          .includes(this.searchText.toLowerCase());
      });
      this.student_list = arr1;
    } else {
      this.student_list = this.student_list_bkp;
    }
  }

  ionClear() {
    this.student_list = this.student_list_bkp;
  }

  async student_btn_click(slist) {
    console.log("slist docid", slist._id);

    this.value = slist;
    const modal = await this.modalController.create({
      component: HblAssessmentPage,
      componentProps: {
        res: {
          docid: this.value._id,
          userid: this.value.userid,
          username: this.value.username,
          studentid: this.value.studentid,
          studentname: this.value.studentname,
          program: this.value.program,
          class: this.value.class,
          gender: this.value.gender,
          phone: this.value.phone,
          school: this.value.school,
          parentsname: this.value.parentsname,
          dob: this.value.dob,
        },
      },
    });

    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }

  async open_register_modal(studentObj, flag) {
    if (studentObj.studentcategory === "hbl") {
      const modal = await this.modalController.create({
        component: HblRegisterPage,
        componentProps: {
          res: {
            flag: flag,
            studentObj: studentObj,
            school_list: this.school_list,
            program: studentObj.program,
          },
        },
        // showBackdrop: true,
      });
      modal.onDidDismiss().then((data) => {
        this.getallstudents(this._userid);
      });
      return await modal.present();
    } else {
      this.showAlert(this.popovr_heading, "", this.popovr_msg);
    }
  }

  delete_button_click(student) {
    if (student.studentcategory === "hbl") {
      const id = student._id;
      const studentname = student.studentname;
      this.showConfirm(
        this.del_msg_heading,
        "",
        this.del_msg1 + studentname + this.del_msg2,
        id
      );
    } else {
      this.showAlert(this.popovr_heading, "", this.popovr_msg);
    }
  }

  // confirm box
  async showConfirm(
    header: string,
    subHeader: string,
    message: string,
    id: any
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
          handler: () => {},
        },
        {
          text: "Ok",
          handler: () => {
            this.delete_student(id);
          },
        },
      ],
    });
    await alert.present();
  }

  async delete_student(id) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.deactivatestudentbyid(id).subscribe(
      (res) => {
        this.getallstudents(this._userid);
        loading.dismiss();
      },
      (err) => {
        this.getallstudents(this._userid);
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async showEditDeleteMenu(student, ev) {
    if (student.studentcategory === "hbl") {
      const alert = await this.alertController.create({
        header: this.edit_dlt_header,
        subHeader: "",
        message: this.edit_dlt_msg,
        mode: "ios",
        inputs: [
          {
            //this.edit_btn
            name: "update",
            type: "radio",
            label: this.edit_btn,
            value: "update",
            handler: () => {
              this.open_register_modal(student, "edit");
              this.alertController.dismiss();
            },
          },
          {
            name: "delete",
            type: "radio",
            label: this.dlt_btn,
            value: "delete",
            handler: () => {
              this.delete_student(student._id);
              this.alertController.dismiss();
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.showAlert(this.popovr_heading, "", this.popovr_msg);
    }
  }

  // --->>>Removed<<<---
  // async openPopOver(student, ev: any) {
  //   if (student.studentcategory === "hbl") {
  //     const popover = await this.popoverCtrl.create({
  //       component: HblPopoverComponent,
  //       componentProps: {
  //         res: {
  //           studentObj: student,
  //           program: this.program,
  //         },
  //       },
  //       event: ev,
  //       showBackdrop: true,
  //       translucent: true,
  //       animated: true,
  //     });
  //     popover.onDidDismiss().then(() => {
  //       this.getallstudents(this._userid);
  //     });
  //     return await popover.present();
  //   } else {
  //     this.showAlert(this.popovr_heading, "", this.popovr_msg);
  //   }
  // }

  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  open_hbl_activitypage() {
    this.router.navigate(["/hbl-activity"]);
  }

  calltoroot() {
    this.navController.navigateBack("/home-results");
  }

  async fillResponse(studentdata) {
    // console.log("fillResponse", this.passcode);
    let dt = new Date();
    let dd = new Date().getDate();
    let mm = new Date().getMonth();
    let yr = new Date().getFullYear();
    let fullDt = dd + "/" + mm + "/" + yr;
    let schoolName;
    let schoolid = "tz123";
    if (studentdata.school == undefined) {
      schoolName = "ThinkZone School";
    } else {
      schoolName = studentdata.school;
    }

    const modal = await this.modalController.create({
      component: CallresponsePage,
      componentProps: {
        res: {
          userid: this._userid,
          username: this._username,
          usertype: this.usertype,
          studentName: studentdata.studentname,
          studentid: studentdata.studentid,
          program: studentdata.program,
          class: studentdata.class,
          // subject: ,
          schoolname: schoolName,
          schoolid: schoolid,
          udise: schoolid,
          phoneno: studentdata.phone,
          calledon: dt,
          fullDate: fullDt,
          passcode: this.passcode,
          // feedback:,
        },
      },
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }

  callStudent(studentdata) {
    let num = studentdata.phone;
    this.callNumber
      .callNumber(num, true)
      .then((res) => {
        this.showFillBtn = true;
        this.fillResponse(studentdata);
      })
      .catch((err) => {});
  }
}
