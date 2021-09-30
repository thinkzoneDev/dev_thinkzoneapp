import { Component, OnInit } from "@angular/core";
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
  selector: "app-hbl-register",
  templateUrl: "./hbl-register.page.html",
  styleUrls: ["./hbl-register.page.scss"],
})
export class HblRegisterPage implements OnInit {
  buttonclass = "hidden";
  _userid: string;
  _username: string;
  usertype: string;
  _id = "";
  _studentid = "";
  _studentname = "";
  _class = "";
  _school = "";
  _phone: number;
  _dob = "";
  _parentsname = "";
  _registration_date = "";
  school_list = [];
  studentname = "";
  studentcategory = "hbl";
  program = "";
  selected_class = "";
  selected_school = "";
  selected_class_text = "";
  selected_class_txt_translate = "";
  phone: number;
  gender = "";
  dob = "";
  parentsname = "";
  registration_date = "";
  res: any;
  flag = "";
  studentObj: any = {};
  class_list: any = [];
  msg_heading: string;
  msg_success: string;
  msg_fail: string;
  is_selected: boolean;
  isFellow: boolean;

  hide_class_field = false;

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
    private router: Router,
    private serverDownMsg: ServerDownService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this.usertype = localStorage.getItem("_usertype");

    this.selected_school = localStorage.getItem("_school");
    // this.getAllSchools();

    this.res = this.navParams.data.res;
    this.flag = this.res.flag;

    this.checkUsertype();
    //translator variables
    this.selected_class_txt_translate = this.translateService.get(
      "HBLREGISTER.select_class"
    )["value"];
    this.msg_heading = this.translateService.get("REGISTER.msg_heading")[
      "value"
    ];
    this.msg_success = this.translateService.get("REGISTER.msg_success")[
      "value"
    ];
    this.msg_fail = this.translateService.get("REGISTER.msg_fail")["value"];

    console.log("navparams", this.res);
  }

  ngOnInit() {
    this.initialize_fields(this.flag);
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

  initialize_fields(flag) {
    if (flag === "edit") {
      this._id = this.res.studentObj._id;
      this._studentid = this.res.studentObj.studentid;
      this._studentname = this.res.studentObj.studentname;
      this.program = this.res.studentObj.program;
      this._class = this.res.studentObj.class;
      // this.school_list = this.res.school_list;
      // this._school = this.res.studentObj.school;
      // this.selected_school = this.res.studentObj.school;
      this._phone = this.res.studentObj.phone;
      this.gender = this.res.studentObj.gender;
      this._dob = this.res.studentObj.dob;
      this._parentsname = this.res.studentObj.parentsname;
      this._registration_date = this.res.studentObj.createdon;
      this.select_program_onchange(this.program);
    } else {
      this._id = "";
      this._studentid = "";
      this._studentname = "";
      this.program = "";
      this._class = "";
      this.gender = "";
      this._dob = "";
      this._parentsname = "";
      this._registration_date = "";
    }
    this.studentname = this._studentname;
    this.program = this.program;
    this.selected_class = this._class;
    // this.selected_school = this._school;
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
    this.displayClassList(value);
  }

  displayClassList(value) {
    this.program = value;
    this.is_selected = false;
    if (value === "ece") {
      this.selected_class = "0";
      this.hide_class_field = true;
      this.is_selected = false;
    } else if (value === "pge") {
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
        studentid: new Date().getTime(),
        studentname: this.studentname,
        studentcategory: this.studentcategory,
        program: this.program,
        class: this.selected_class,
        school: this.selected_school,
        phone: this.phone,
        gender: this.gender,
        dob: this.dob,
        parentsname: this.parentsname,
      };
    } else {
      details = {
        userid: this._userid,
        username: this._username,
        studentid: new Date().getTime(),
        studentname: this.studentname,
        studentcategory: this.studentcategory,
        program: this.program,
        class: this.selected_class,
        school: this.selected_school,
        phone: this.phone,
        gender: this.gender,
        dob: this.dob,
        parentsname: this.parentsname,
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
        this.serverDownMsg.presentToast();
      }
    );
  }

  async update_registration() {
    const details = {
      userid: this._userid,
      username: this._username,
      studentid: this._studentid,
      studentname: this.studentname,
      program: this.program,
      class: this.selected_class,
      // school: this.selected_school,
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
      // } else if (
      //   this.selected_school === undefined ||
      //   this.selected_school == null ||
      //   this.selected_school === ""
      // ) {
      //   this.showAlert("Verify", "", "Please select School");
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

  closeModal(flag) {
    let dismissObj = {};
    if (flag === "cancel") dismissObj = { data: "cancel" };
    else dismissObj = { data: "save" };
    this.modalController.dismiss(dismissObj, "backdrop");
  }

  ngOnDestroy() {
    if (window.history.state.modal) {
      history.back();
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

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: "bottom",
    });
    toast.present();
  }
}
