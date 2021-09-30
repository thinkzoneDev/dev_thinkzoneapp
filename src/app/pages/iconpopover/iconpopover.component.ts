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
import { StudentregisterPage } from "../studentregister/studentregister.page";
// api
import { RestApiService } from "./../../rest-api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-iconpopover",
  templateUrl: "./iconpopover.component.html",
  styleUrls: ["./iconpopover.component.scss"],
})
export class IconpopoverComponent implements OnInit {
  student;
  errormessage = "";
  student_list: any = [];
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  constructor(
    public popoverController: PopoverController,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    public api: RestApiService,
    public navParams: NavParams,
    private router: Router
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";
    // this.getallstudents(this._userid);
  }

  ngOnInit() {
    this.student = this.navParams.data.res;
  }

  async open_register_modal(studentObj, flag) {
    this.closeBaseModal();
    const modal = await this.modalController.create({
      component: StudentregisterPage,
      componentProps: { res: { flag: flag, studentObj: studentObj } },
    });
    modal.onDidDismiss().then((data) => {
      this.closeModal();
    });
    return await modal.present();
  }

  delete_button_click(student) {
    this.closeBaseModal();
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
        // this.getallstudents(this._userid);
        this.router
          .navigateByUrl("/home-results", {
            skipLocationChange: false,
          })
          .then(() => this.router.navigate(["/studentexplor/"]));
        loading.dismiss();
      },
      (err) => {
        this.router
          .navigateByUrl("/home-results", {
            skipLocationChange: false,
          })
          .then(() => this.router.navigate(["/studentexplor/"]));
        // this.getallstudents(this._userid);
        loading.dismiss();
      }
    );
  }

  async getallstudents(userid) {
    const studentcategory = "app";
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api
      .getallstudentsbystudentcategory(userid, studentcategory)
      .subscribe(
        (res) => {
          // this.getProgramCount(res);
          this.student_list = res;
          this.student_list.forEach((element) => {
            element.hidden = true;
            element.english = {
              hidden: true,
              val: element.eng_level,
            };
            element.math = {
              hidden: true,
              val: element.math_level,
            };
            element.odia = {
              hidden: true,
              val: element.odia_level,
            };
            element.ece = {
              hidden: true,
              val: element.ec_level,
            };
          });
          loading.dismiss();
          this.closeModal();
        },
        (err) => {
          this.errormessage = err;
          this.student_list = [];
          loading.dismiss();
        }
      );
  }

  closeModal() {
    // this.popoverController.dismiss("Cancel");
  }

  closeBaseModal() {
    this.popoverController.dismiss();
  }

  flipStudentDisplay(student) {
    this.closeBaseModal();
    // this.displaystudent.english.hidden = true;
    // this.displaystudent.english.hidden = true;
    // this.displaystudent.english.hidden = true;
    // this.displaystudent.english.hidden = true;
    // if (this.displaystudent.studentname === student.studentname) {
    //   this.displaystudent.hidden = true;
    // } else {
    //   this.displaystudent.hidden = true;
    //   student.hidden = false;
    //   this.displaystudent = student;
    // }

    if (student.hidden) {
      this.student_list.forEach((element) => {
        element.hidden = true;
        if (element.program === "pge") {
          element.english.val = student.eng_level;
          element.english.hidden = true;
          element.math.val = student.math_level;
          element.math.hidden = true;
          element.odia.val = student.odia_level;
          element.odia.hidden = true;
        } else {
          element.ece.val = student.ec_level;
          element.ece.hidden = true;
        }
      });

      student.hidden = false;
      if (student.program === "pge") {
        student.english.val = student.eng_level;
        student.english.hidden = true;
        student.math.val = student.math_level;
        student.math.hidden = true;
        student.odia.val = student.odia_level;
        student.odia.hidden = true;
      } else {
        student.ece.val = student.ec_level;
        student.ece.hidden = true;
      }

      return;
    }
    student.hidden = true;
    if (student.program === "pge") {
      student.english.val = student.eng_level;
      student.english.hidden = true;
      student.math.val = student.math_level;
      student.math.hidden = true;
      student.odia.val = student.odia_level;
      student.odia.hidden = true;
    } else {
      student.ece.val = student.ec_level;
      student.ece.hidden = true;
    }
  }
}
