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

import { TranslateService } from "@ngx-translate/core";

// Geolocation
import { Geolocation } from "@ionic-native/geolocation/ngx";

// Modals
import { RestApiService } from "./../../../rest-api.service";
import { StudentObject } from "./studentobject";

@Component({
  selector: "app-attendancemodal",
  templateUrl: "./attendancemodal.page.html",
  styleUrls: ["./attendancemodal.page.scss"],
})
export class AttendancemodalPage {
  attendance_status = "Absent";
  student_list: any = [];
  attendance_list: any = [];
  attendance_date: string = new Date().toISOString();
  attendance_day = "";
  new_student_list: StudentObject[] = [];
  res: any;
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  toolbarshadow = true;
  present = 0;
  total = 0;
  absent = 0;
  unattended = 0;
  errormessage = "";
  latlng: any = {};

  msg_nostudent: string = "";
  msg_head_nostudent: string = "";
  msg_head: string = "";
  msg_save_success: string = "";
  msg_markAtdnc: string = "";

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
    public navParams: NavParams,
    private geolocation: Geolocation
  ) {
    // modal parameters
    this.res = this.navParams.data.res;
    this._userid = this.res.userid;
    this._username = this.res.username;
    this.attendance_date = this.res.date;
    this.attendance_day = this.res.day;
    this._centerid = "";
    this._centername = "";

    // translator variables
    this.msg_nostudent = this.translateService.get(
      "TAKEATTENDANCE.msg_nostudent"
    )["value"];
    this.msg_head_nostudent = this.translateService.get(
      "TAKEATTENDANCE.msg_head_nostudent"
    )["value"];
    this.msg_head = this.translateService.get("TAKEATTENDANCE.msg_head")[
      "value"
    ];
    this.msg_save_success = this.translateService.get(
      "TAKEATTENDANCE.msg_save_success"
    )["value"];
    this.msg_markAtdnc = this.translateService.get(
      "TAKEATTENDANCE.msg_markAtdnc"
    )["value"];

    // this.getGeolocation();  // commented by nrusingh on 4.11.2019 since app was slow down in low network area
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
          if (this.student_list == "") {
            this.showAlert(this.msg_head_nostudent, "", this.msg_nostudent);
          } else {
          }

          if (this.student_list != null) {
            this.total = this.student_list.length;
            this.unattended = this.total;
            this.student_list.forEach((element) => {
              this.new_student_list.push({
                absentbutton: "circle shadow",
                detail: element,
                presentbutton: "circle shadow",
                selectionState: 0,
                bgclass: "",
              });
            });
          }
          loading.dismiss();
        },
        (err) => {
          this.errormessage = err;
          loading.dismiss();
        }
      );
  }

  // present or absent choosen
  segmentChanged(student, value) {
    this.add_to_attendancelist(
      student.studentid,
      student.studentname,
      student.program,
      value
    );
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
      geolocation: this.latlng,
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

  // save attendance module
  async save_attendace() {
    if (this.student_list.length === this.attendance_list.length) {
      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.saveattendance(this.attendance_list).subscribe(
        (res) => {
          if (res["status"] == "success") {
            this.showAlert(this.msg_head, "", this.msg_save_success);
          } else {
            this.showAlert(
              this.msg_head,
              "",
              "Attendance saved " + res["status"] + " !!!"
            );
          }
          //this.showAlert('Info', '', 'Attendance saved ' + res['status'] + ' !!!');
          loading.dismiss();
          this.modalController.dismiss({ data: "Ok" });
        },
        (err) => {
          loading.dismiss();
        }
      );
    } else {
      this.showAlert(this.msg_head, "", this.msg_markAtdnc);
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

  setState(s, student) {
    if (s === student.selectionState) {
      return;
    }
    if (student.selectionState === 0) {
      if (s === 1) {
        student.bgclass = "";
        student.presentbutton = "w2g circle";
        this.present++;
      } else {
        this.absent++;
        student.bgclass = "";
        student.absentbutton = "w2r circle";
      }
    } else if (s === 2) {
      this.absent++;
      this.present--;
      student.bgclass = "";
      student.presentbutton = "g2w shadow circle";
      student.absentbutton = "w2r circle";
    } else {
      this.present++;
      this.absent--;
      student.bgclass = "";
      student.presentbutton = "w2g circle";
      student.absentbutton = "r2w shadow circle";
    }
    this.add_to_attendancelist(
      student.detail.studentid,
      student.detail.studentname,
      student.detail.program,
      s === 1 ? "present" : "absent"
    );
    student.selectionState = s;
    this.unattended = this.total - this.present - this.absent;
  }

  // get geolocation
  async getGeolocation() {
    let loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    try {
      this.geolocation
        .getCurrentPosition()
        .then((resp) => {
          var obj = {
            lat: resp.coords.latitude,
            lng: resp.coords.longitude,
          };
          this.latlng = obj;
          loading.dismiss();
          //this.showAlert("Location", "Current location", "Latitude: "+resp.coords.latitude+"    <br>Longitude: "+resp.coords.longitude);
        })
        .catch((error) => {});
    } catch (e) {
      alert("WebView geo error");
    }
  }
}
