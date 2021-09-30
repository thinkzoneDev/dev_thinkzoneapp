import { Component } from "@angular/core";
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
import { RestApiService } from "./../../rest-api.service";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-studentregister",
  templateUrl: "./studentregister.page.html",
  styleUrls: ["./studentregister.page.scss"],
})
export class StudentregisterPage {
  buttonclass = "hidden";
  _userid: string;
  _username: string;
  usertype: string;
  _centerid: string;
  _centername: string;

  // information from modal res side
  _id = "";
  _studentid = "";
  _studentname = "";
  // _program = '';
  _class = "";
  _phone: number;
  // _gender = '';
  _dob = "";
  _parentsname = "";
  _registration_date = "";

  studentname = "";
  studentcategory = "app";
  program = "";
  selected_class = "";
  selected_class_text = "";
  is_selected: boolean;
  isFellow: boolean;
  isHBL: boolean = false;

  phone = 0;
  gender = "";
  dob = "";
  parentsname = "";
  registration_date = "";
  schoolname = "";
  udisecode = "";

  res: any;
  flag = "";
  studentObj: any = {};
  class_list: any = [];

  msg_heading: string;
  msg_success: string;
  msg_fail: string;
  confirmBox_header: string = "";
  confirmBox_msg: string = "";
  confirmBox_ok: string = "";
  confirmBox_cancel: string = "";

  progressSaved: boolean = false;
  hide_class_field = false;
  selected_class_txt_translate: string = "";

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private navParams: NavParams,
    private translateService: TranslateService,
    public router: Router,
    private serverDownMsg: ServerDownService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this.usertype = localStorage.getItem("_usertype");
    this.schoolname = localStorage.getItem("_school");
    this.udisecode = localStorage.getItem("_udise");
    this._centerid = "";
    this._centername = "";

    // modal paramiters
    this.res = this.navParams.data.res;
    this.flag = this.res.flag;

    this.checkUsertype();
    this.initialize_fields(this.flag);

    this.msg_heading = this.translateService.get("REGISTER.msg_heading")[
      "value"
    ];
    this.msg_success = this.translateService.get("REGISTER.msg_success")[
      "value"
    ];
    this.msg_fail = this.translateService.get("REGISTER.msg_fail")["value"];
    this.selected_class_txt_translate = this.translateService.get(
      "HBLREGISTER.select_class"
    )["value"];
    this.confirmBox_header = this.translateService.get("PPT.confirmBox_header")[
      "value"
    ];
    this.confirmBox_msg =
      this.translateService.get("PPT.confirmBox_msg")["value"];
    this.confirmBox_ok =
      this.translateService.get("PPT.confirmBox_ok")["value"];
    this.confirmBox_cancel = this.translateService.get("PPT.confirmBox_cancel")[
      "value"
    ];
  }

  initialize_fields(flag) {
    if (flag === "edit") {
      this._id = this.res.studentObj._id;
      this._studentid = this.res.studentObj.studentid;
      this._studentname = this.res.studentObj.studentname;
      this.program = this.res.studentObj.program;
      this._class = this.res.studentObj.class;
      this._phone = this.res.studentObj.phone;
      this.gender = this.res.studentObj.gender;
      this._dob = this.res.studentObj.dob;
      this._parentsname = this.res.studentObj.parentsname;
      this._registration_date = this.res.studentObj.registration_date;
      this.select_program_onchange(this.program);
    } else {
      this._id = "";
      this._studentid = "";
      this._studentname = "";
      // this.program = "";
      this._class = "";
      // this._phone = 0;
      this.gender = "";
      this._dob = "";
      this._parentsname = "";
      this._registration_date = "";
    }
    this.studentname = this._studentname;
    this.program = this.program;
    this.selected_class = this._class;
    this.phone = this._phone;
    this.gender = this.gender;
    this.dob = this._dob;
    this.parentsname = this._parentsname;
    this.registration_date = this._registration_date;
  }

  checkUsertype() {
    if (this.usertype == "fellow") {
      this.isFellow = true;
    } else if (this.usertype == "school") {
      this.isFellow = false;
      this.select_program_onchange("pge");
    } else if (this.usertype == "anganwadi") {
      this.isFellow = false;
      this.select_program_onchange("ece");
    }
  }

  select_program_onchange(value) {
    this.program = value;
    this.displayClassList();
  }

  displayClassList() {
    if (this.studentcategory == "hbl") {
      if (this.program === "ece") {
        this.selected_class = "0";
        this.hide_class_field = true;
        this.is_selected = false;
      } else if (this.program === "pge") {
        this.selected_class = "";
        this.class_list = ["1", "2", "3", "4", "5"];
        this.selected_class_text = this.selected_class_txt_translate;
        this.hide_class_field = false;
        this.is_selected = true;
      } else {
        this.selected_class = "";
        this.class_list = [];
        this.hide_class_field = false;
        // this.is_selected = true;
      }
      // this reveals the current_class list
      this.buttonclass = "revealer";
    } else if (this.studentcategory == "app") {
      if (this.program === "ece") {
        this.is_selected = true;
        this.selected_class = "";
        this.class_list = ["1", "2", "3"];
        this.selected_class_text = "Select Level";
        this.hide_class_field = false;
      } else if (this.program === "pge") {
        this.is_selected = true;
        this.selected_class = "";
        this.class_list = ["1", "2", "3", "4", "5"];
        this.selected_class_text = "Select Class";
        this.hide_class_field = false;
      } else {
        this.selected_class = "";
        this.class_list = [];
        this.hide_class_field = false;
      }

      // this reveals the current_class list
      this.buttonclass = "revealer";
    }
  }

  checkIsHBL() {
    console.log(this.isHBL);
    if (this.isHBL == true) {
      this.studentcategory = "hbl";
      if (this.program == "ece") {
        this.selected_class = "0";
        this.hide_class_field = true;
        this.is_selected = false;
      }
    } else {
      this.studentcategory = "app";
      if (this.program === "ece") {
        this.is_selected = true;
        this.selected_class = "";
        this.class_list = ["1", "2", "3"];
        this.selected_class_text = "Select Level";
        this.hide_class_field = false;
      }
    }
    console.log(this.studentcategory);

    // this.displayClassList();
  }

  checkQuizStatus() {
    if (this.progressSaved == false) {
      this.confirmBox(this.confirmBox_header, "", this.confirmBox_msg);
    } else {
      this.closeModal("cancel");
    }
  }

  select_class_onchange(value) {
    this.selected_class = value;
  }

  gender_onchange(value) {
    this.gender = value;
  }

  dob_onhange(value) {
    this.dob = value;
  }

  regdate_onhange() {
    this.registration_date = new Date().toString();
  }

  reset() {
    this.studentname = "";
    this.phone = 0;
    this.parentsname = "";
  }

  async new_registration() {
    let details = {};
    if (
      this.registration_date == null ||
      this.registration_date == undefined ||
      this.registration_date == ""
    ) {
      details = {
        userid: this._userid,
        username: this._username,
        centerid: this._centerid,
        centername: this._centername,
        studentid: new Date().getTime(),
        studentname: this.studentname,
        studentcategory: this.studentcategory,
        program: this.program,
        ec_level: this.selected_class,
        math_level: this.selected_class,
        eng_level: this.selected_class,
        odia_level: this.selected_class,
        class: this.selected_class,
        phone: this.phone,
        gender: this.gender,
        dob: this.dob,
        parentsname: this.parentsname,
        school: this.schoolname,
        udise: this.udisecode,
      };
    } else {
      details = {
        userid: this._userid,
        username: this._username,
        centerid: this._centerid,
        centername: this._centername,
        studentid: new Date().getTime(),
        studentname: this.studentname,
        studentcategory: this.studentcategory,
        program: this.program,
        ec_level: this.selected_class,
        math_level: this.selected_class,
        eng_level: this.selected_class,
        odia_level: this.selected_class,
        class: this.selected_class,
        phone: this.phone,
        gender: this.gender,
        dob: this.dob,
        parentsname: this.parentsname,
        school: this.schoolname,
        udise: this.udisecode,
        registration_date: this.registration_date,
      };
    }
    this.newregistration_savedata(details);
  }

  async newregistration_savedata(details) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.registernewstudent(details).subscribe(
      (res) => {
        let docid = res.data._id;
        // this.setLevel(docid, this.selected_class);
        loading.dismiss();
        this.reset();
        this.closeModal("save");
        if (res["status"] == "success") {
          this.showAlert(this.msg_heading, "", this.msg_success);
        }
        this.router.navigate(["/studentexplor"]);
      },
      (err) => {
        loading.dismiss();
        this.showAlert(this.msg_heading, "", this.msg_fail);
      }
    );
  }

  // async setLevel(_id, newlevel) {
  //   const dataEng = {
  //     detailsid: _id,
  //     subject: "eng",
  //     level: newlevel,
  //     baselinetest: null,
  //     baselinetestresult: null,
  //   };

  //   const dataMath = {
  //     detailsid: _id,
  //     subject: "math",
  //     level: newlevel,
  //     baselinetest: null,
  //     baselinetestresult: null,
  //   };

  //   const dataOdia = {
  //     detailsid: _id,
  //     subject: "odia",
  //     level: newlevel,
  //     baselinetest: null,
  //     baselinetestresult: null,
  //   };

  //   const dataECE = {
  //     detailsid: _id,
  //     subject: "na",
  //     level: newlevel,
  //     baselinetest: null,
  //     baselinetestresult: null,
  //   };
  //   const loading = await this.loadingController.create({});
  //   await loading.present();
  //   await this.api.setlevelbyid(dataEng).subscribe(
  //     async (res) => {
  //       loading.dismiss();
  //       if (res["status"] == "success") {
  //         await this.api.setlevelbyid(dataMath).subscribe(
  //           async (res) => {
  //             loading.dismiss();
  //             if (res["status"] == "success") {
  //               await this.api.setlevelbyid(dataOdia).subscribe(
  //                 (res) => {
  //                   loading.dismiss();
  //                   if (res["status"] == "success") {
  //                     this.api.setlevelbyid(dataECE).subscribe(
  //                       (res) => {
  //                         loading.dismiss();
  //                         if (res["status"] == "success") {
  //                         } else {
  //                         }
  //                       },
  //                       (err) => {
  //                         loading.dismiss();
  //                       }
  //                     );
  //                   } else {
  //                   }
  //                 },
  //                 (err) => {
  //                   loading.dismiss();
  //                 }
  //               );
  //             } else {
  //             }
  //           },
  //           (err) => {
  //             loading.dismiss();
  //           }
  //         );
  //       } else {
  //       }
  //     },
  //     (err) => {
  //       loading.dismiss();
  //     }
  //   );
  // }

  async update_registration() {
    const details = {
      userid: this._userid,
      username: this._username,
      centerid: this._centerid,
      centername: this._centername,
      studentid: this._studentid,
      studentname: this.studentname,
      studentcategory: this.studentcategory,
      program: this.program,
      ec_level: this.selected_class,
      math_level: this.selected_class,
      eng_level: this.selected_class,
      odia_level: this.selected_class,
      class: this.selected_class,
      phone: this.phone,
      gender: this.gender,
      dob: this.dob,
      parentsname: this.parentsname,
      registration_date: this.registration_date,
    };

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.updatestudent(this._id, details).subscribe(
      (res) => {
        this.update_student_name_in_tchassessmenttest(
          this._studentid,
          this.studentname
        );
        loading.dismiss();
        this.reset();
        this.closeModal("save");
        if (res["status"]) {
          this.showAlert(this.msg_heading, "", this.msg_success);
        }

        this.router.navigate(["/studentexplor"]);
      },
      (err) => {
        loading.dismiss();
        this.showAlert(this.msg_heading, "", this.msg_fail);
      }
    );
  }

  async update_student_name_in_tchassessmenttest(studentid, studentname) {
    let details = {
      studentname: studentname,
    };
    await this.api
      .updatetchassessmenttestbystudentid(studentid, details)
      .subscribe(
        (res) => {},
        (err) => {
          // console.log(err);
          this.serverDownMsg.presentToast();
        }
      );
  }

  register_button_click() {
    this.regdate_onhange();
    const phone_pattern = /^[6-9]\d{9}$/;
    if (
      this.studentname === undefined ||
      this.studentname == null ||
      this.studentname === ""
    ) {
      this.showAlert("Verify", "", "Please enter student's name");
    } else if (
      this.parentsname === undefined ||
      this.parentsname == null ||
      this.parentsname === ""
    ) {
      this.showAlert("Verify", "", " Please enter the guardian's name");
    } else if (
      this.gender === undefined ||
      this.gender == null ||
      this.gender === ""
    ) {
      this.showAlert("Verify", "", "Please select Gender");
    } else if (this.phone === undefined || this.phone == null) {
      this.showAlert("Verify", "", "Please enter Mobile number");
    } else if (!phone_pattern.test("" + this.phone)) {
      this.showAlert(
        "Verify",
        "",
        "Please enter a valid 10-digit Mobile number"
      );
    } else if (this.dob === undefined || this.dob == null || this.dob === "") {
      this.showAlert("Verify", "", "Please enter Date of Birth");
    } else if (
      this.program === undefined ||
      this.program == null ||
      this.program === ""
    ) {
      this.showAlert("Verify", "", "Please select Program");
    } else if (
      this.selected_class === undefined ||
      this.selected_class == null ||
      this.selected_class === ""
    ) {
      this.showAlert("Verify", "", "Please select Class");
    } else {
      if (this.flag === "new") {
        this.new_registration();
      } else if (this.flag === "edit") {
        this.update_registration();
      }
    }
  }

  // close modal
  closeModal(flag) {
    let dismissObj = {};
    if (flag === "cancel") dismissObj = { data: "cancel" };
    else dismissObj = { data: "save" };
    this.modalController.dismiss(dismissObj);
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

  async confirmBox(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: this.confirmBox_cancel,
          role: "cancel",
          handler: () => {},
        },
        {
          text: this.confirmBox_ok,
          handler: () => {
            this.closeModal("cancel");
          },
        },
      ],
    });
    await alert.present();
  }
}
