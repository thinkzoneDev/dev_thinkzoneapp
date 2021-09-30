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
import { TranslateService } from "@ngx-translate/core";

import { ViewpaymentPage } from "./../modal/viewpayment/viewpayment.page";
import { MakepaymentPage } from "./../modal/makepayment/makepayment.page";

// Modals
import { RestApiService } from "./../../rest-api.service";

@Component({
  selector: "app-tchpayment",
  templateUrl: "./tchpayment.page.html",
  styleUrls: ["./tchpayment.page.scss"],
})
export class TchpaymentPage {
  attendance_status = "Absent";
  student_list: any = [];
  attendance_list: any = [];
  attendance_date: string = new Date().toISOString();
  attendance_day = "";

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  toolbarshadow = true;
  errormessage = "";
  msg: string;
  msg_heading: string;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private translateService: TranslateService
  ) {
    // modal paramiters
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";
    this.msg = this.translateService.get("EXPLORE.msg")["value"];
    this.msg_heading = this.translateService.get("EXPLORE.msg_heading")[
      "value"
    ];
    this.getallstudents();
  }

  // get student list
  async getallstudents() {
    const studentcategory = "app";
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api
      .getallstudentsbystudentcategory(this._userid, studentcategory)
      .subscribe(
        (res) => {
          this.student_list = res;
          if (this.student_list === null || this.student_list.length === 0) {
            this.errormessage = "No student details found!";
            this.showAlert(this.msg_heading, "", this.msg);
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
        }
      );
  }

  async viewpayment(student) {
    const modal = await this.modalController.create({
      component: ViewpaymentPage,
      componentProps: { res: student },
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }

  async makepayment(student) {
    const modal = await this.modalController.create({
      component: MakepaymentPage,
      componentProps: { res: student },
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }

  // present or absent choosen
  async segmentChanged(student, value) {
    // this.add_to_attendancelist(student.studentid, student.studentname, student.program, value);
    let modalPage: any;
    if (value === "view") {
      modalPage = ViewpaymentPage;
    } else {
      modalPage = MakepaymentPage;
    }

    // redirect to modal page
    const modal = await this.modalController.create({
      component: modalPage,
      componentProps: { res: student },
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }

  // add to attendance list
  add_to_attendancelist(studentid, studentname, program, availability) {
    const obj = {
      isholiday: false,
      holidayname: "",
      availability: availability,
      userid: this._userid,
      username: this._username,
      centerid: "",
      centername: "",
      attendancedate: this.attendance_date,
      attendanceday: this.attendance_day,
      studentid: studentid,
      studentname: studentname,
      program: program,
    };

    if (this.attendance_list.length > 0) {
      // check for record exist or not
      let i = 0,
        index = -1;
      this.attendance_list.forEach((element) => {
        if (element.studentid === studentid) {
          index = i;
          return;
        }
        i++;
      });
      if (index >= 0) {
        this.attendance_list.splice(index, 1, obj);
      } else {
        this.attendance_list.push(obj);
      }
    } else {
      this.attendance_list.push(obj);
    }
  }

  // save attendance
  async save_attendace() {
    if (this.student_list.length === this.attendance_list.length) {
      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.saveattendance(this.attendance_list).subscribe(
        (res) => {
          if (res["status"]) {
            this.showAlert("Info", "", "Attendance saved Successfully");
          }
          // this.showAlert('Info', '', 'Attendance saved ' + res['status'] + ' !!!');
          loading.dismiss();
          this.modalController.dismiss({ data: "Ok" });
        },
        (err) => {
          loading.dismiss();
        }
      );
    } else {
      this.showAlert("Info", "", "Please enter sttendance of all students.");
    }
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

  // close modal
  closeModal() {
    this.modalController.dismiss({ data: "Cancel" });
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
}
