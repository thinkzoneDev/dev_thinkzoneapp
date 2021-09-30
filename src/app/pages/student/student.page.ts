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

import { RestApiService } from "./../../rest-api.service";
import { StudentregisterPage } from "./../studentregister/studentregister.page";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
  selector: "app-student",
  templateUrl: "./student.page.html",
  styleUrls: ["./student.page.scss"],
})
export class StudentPage {
  buttonclass = "hidden"; // remove this
  public onRegisterForm: FormGroup;
  class_list: any = [];
  student_name = "";
  program = "";
  class = "";
  phone = 0;
  gender = "";
  dob = "";
  father = "";
  student_list: any = [];

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  toolbarshadow = true;
  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder
  ) {
    this.onRegisterForm = this.formBuilder.group({
      fullName: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      father: ["", [Validators.required]],
    });

    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";
    this.getallstudents(this._userid);
  }

  select_program_onchange(value) {
    this.program = value;
    if (value === "ece") {
      this.class_list = ["0"]; // 0 = Anganwadi
    } else if (value === "pge") {
      this.class_list = ["1", "2", "3", "4", "5", "6", "7"];
    } else {
      this.class_list = [];
    }

    // this reveals the class list
    this.buttonclass = "revealer";
  }

  select_class_onchange(value) {
    this.class = value;
  }

  gender_onchange(value) {
    this.gender = value;
  }

  dob_onhange(value) {
    this.dob = value;
  }

  async getallstudents(userid) {
    const studentcategory = "app";
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api
      .getallstudentsbystudentcategory(userid, studentcategory)
      .subscribe(
        (res) => {
          this.student_list = res;
          loading.dismiss();
        },
        (err) => {
          this.student_list = [];
          loading.dismiss();
        }
      );
  }

  async explor() {
    this.navController.navigateForward("/studentexplor");
  }

  reset() {
    this.student_name = "";
    this.phone = 0;
    this.father = "";
  }

  async signUp() {
    if (!this.onRegisterForm.valid) {
      return;
    }
    this.student_name = this.onRegisterForm.value.fullName;
    this.phone = this.onRegisterForm.value.phone;
    this.father = this.onRegisterForm.value.father;

    if (
      this.student_name === undefined ||
      this.student_name == null ||
      this.student_name === ""
    ) {
      this.showAlert("Verify", "", "Please check Student full name !!!");
    } else if (
      this.program === undefined ||
      this.program == null ||
      this.program === ""
    ) {
      this.showAlert("Verify", "", "Please select Program !!!");
    } else if (
      this.class === undefined ||
      this.class == null ||
      this.class === ""
    ) {
      this.showAlert("Verify", "", "Please select Class !!!");
      // } else if(this.[this.phone == undefined || this.phone == null || this.phone == ''){
      //  this.showAlert('Verify', '', 'Please check Phone !!!');
    } else if (
      this.gender === undefined ||
      this.gender == null ||
      this.gender === ""
    ) {
      this.showAlert("Verify", "", "Please select Gender !!!");
    } else if (this.dob === undefined || this.dob == null || this.dob === "") {
      this.showAlert("Verify", "", "Please check DOB !!!");
    } else if (
      this.father === undefined ||
      this.father == null ||
      this.father === ""
    ) {
      this.showAlert("Verify", "", "Please check Father name !!!");
    } else {
      // this.showAlert('Verify', '', 'OK !!!');
      // proceed to save
      const details = {
        userid: this._userid,
        username: this._username,
        centerid: this._centerid,
        centername: this._centername,
        studentid: new Date().getTime(),
        studentname: this.student_name,
        program: this.program,
        class: this.class,
        phone: this.phone,
        gender: this.gender,
        dob: this.dob,
        parentsname: this.father,
      };

      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.registernewstudent(details).subscribe(
        (res) => {
          loading.dismiss();
          this.reset();
          this.showAlert(
            "Student Registration",
            "",
            "Student registration " + res["status"] + " !!!"
          );
        },
        (err) => {
          loading.dismiss();
          this.showAlert(
            "Student Registration",
            "",
            "Student registration failed !!!"
          );
        }
      );
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
    alert.present();
  }
  async open_register_modal(studentObj, flag) {
    /*  studentObj == null <-- new user register
        else               <-- existing user update
    */
    const modal = await this.modalController.create({
      component: StudentregisterPage,
      componentProps: { res: { flag: flag, studentObj: studentObj } },
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }

  delete_button_click(student) {
    const id = student._id;
    const studentname = student.studentname;
    this.showConfirm(
      "Confirmation !!!",
      "",
      "Are you sure to delete this records of " + studentname + "?",
      id
    );
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
          handler: (blah) => {},
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
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.deletestudentbyid(id).subscribe(
      (res) => {
        this.getallstudents(this._userid);
        loading.dismiss();
      },
      (err) => {
        this.getallstudents(this._userid);
        loading.dismiss();
      }
    );
  }
}
