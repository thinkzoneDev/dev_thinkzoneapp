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

import { TranslateService } from "@ngx-translate/core";

// Modals
import { SearchFilterPage } from "../../pages/modal/search-filter/search-filter.page";
import { ImagePage } from "./../modal/image/image.page";
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from "./../../components/notifications/notifications.component";
import { BaselinePage } from "./../modal/baseline/baseline.page";

// api
import { RestApiService } from "./../../rest-api.service";

// Camera
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
// Geolocation
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { StudentregisterPage } from "../studentregister/studentregister.page";
import { IconpopoverComponent } from "../iconpopover/iconpopover.component";
import { HblAssessmentPage } from "../hbl-assessment/hbl-assessment.page";
import { HblRegisterPage } from "../hbl-register/hbl-register.page";
import { EcassessmentPage } from "../ecassessment/ecassessment.page";
import { PgassessmentPage } from "../pgassessment/pgassessment.page";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { CallresponsePage } from "../callresponse/callresponse.page";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-studentexplor",
  templateUrl: "./studentexplor.page.html",
  styleUrls: ["./studentexplor.page.scss"],
})
export class StudentExplorPage {
  // public navParams = new NavParams();
  public eceValuechange: any;
  searchText: any = "";
  student_list: any = [];
  student_list_bkp: any = [];
  student_name = "";
  program = "";
  class = "";
  phone = 0;
  gender = "";
  dob = "";
  father = "";
  items: any = [];
  close = false;
  totalCount: any;

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
  usertype: string;
  _centerid: string;
  _centername: string;
  userid: string;
  // studentname: string;
  program1: string = "";
  level: string = "";
  stage: string = "";
  subject = {};
  isFellow: boolean;
  isAnganwadiOrSchool: boolean;

  msg: string = "";
  msg_heading: string = "";
  del_msg_heading: string = "";
  del_msg1: string = "";
  del_msg2: string = "";

  // baselineStatus: boolean = false;
  toolbarshadow = true;
  levels = [1, 2, 3, 4, 5];
  ece_levels = [1, 2, 3];
  errormessage = "";
  displaystudent: any;
  countEce = 0;
  countPge = 0;
  showAction = [];
  hblStudent: any;
  showFillBtn: boolean;
  passcode: any;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private zone: NgZone,
    private callNumber: CallNumber,
    private loadingController: LoadingController,
    private translateService: TranslateService,
    private camera: Camera,
    private geolocation: Geolocation,
    private router: Router,
    private serverDownMsg: ServerDownService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this.usertype = localStorage.getItem("_usertype");
    this.passcode = localStorage.getItem("_passcode");
    this._centerid = "";
    this._centername = "";
    this.checkUsertype();
    this.getallstudents(this._userid);

    this.res = "";
    this.userid = this._userid;
    this.program = "pge";
    this.stage = "month0";

    this.subject = { subject: ' ["math", "english", "odia"]' };

    this.msg = this.translateService.get("EXPLORE.msg")["value"];
    this.msg_heading = this.translateService.get("EXPLORE.msg_heading")[
      "value"
    ];
    this.del_msg_heading = this.translateService.get("EXPLORE.del_msg_heading")[
      "value"
    ];
    this.del_msg1 = this.translateService.get("EXPLORE.del_msg1")["value"];
    this.del_msg2 = this.translateService.get("EXPLORE.del_msg2")["value"];
  }

  // --------------- added by nrusingh on 10.01.2020 for search option for students -----------------
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
  //-----------------------------------------------------------------------------------------------
  // checkCompleted(student) {
  //     if (
  //         student.math_level == 5 &&
  //         student.eng_level == 5 &&
  //         student.odia_level == 5
  //     ) {
  //         return "Base line completed";
  //     }
  // }

  checkUsertype() {
    if (this.usertype == "fellow") {
      this.isFellow = true;
      this.isAnganwadiOrSchool = false;
    } else {
      this.isFellow = false;
      this.isAnganwadiOrSchool = true;
    }
  }

  async getallstudents(userid) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getallstudents(userid).subscribe(
      (res) => {
        this.getProgramCount(res);
        this.student_list = res;
        console.log(this.student_list);

        if (this.student_list == "") {
          this.showAlert(this.msg_heading, "", this.msg);
        } else {
          this.student_list.forEach((value: any) => {
            // if (value.program == "pge" && value.baselinedetails.length == 3) {
            //   value.isAssessmentTaken = true;
            // } else if (
            //   value.program == "ece" &&
            //   value.baselinedetails.length > 0
            // ) {
            //   value.isAssessmentTaken = true;
            // } else {
            //   value.isAssessmentTaken = false;
            // }
          });
        }

        this.student_list_bkp = res;
        this.student_list.forEach((element) => {
          this.showAction[element.studentid] = false;
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
      },

      (err) => {
        console.log(err);
        // if (err.TimeoutErrorImpl) {
        //   console.log("Timeout");
        // }

        loading.dismiss();
        this.errormessage = err;
        this.student_list = [];
        this.serverDownMsg.presentToast();
      }
    );
  }

  async goToAssesmentPage(student) {
    console.log(student);
    if (student.studentcategory === "app") {
      if (student.program === "ece") {
        // this.hblStudent = student;
        const modal = await this.modalController.create({
          component: EcassessmentPage,
          componentProps: {
            res: {
              docid: student._id,
              userid: student.userid,
              username: student.username,
              studentid: student.studentid,
              studentname: student.studentname,
              program: student.program,
              class: student.class,
              gender: student.gender,
              phone: student.phone,
              school: student.school,
              parentsname: student.parentsname,
              dob: student.dob,
            },
          },
        });

        modal.onDidDismiss().then(() => {
          this.getallstudents(this._userid);
        });
        return await modal.present();
      } else {
        this.hblStudent = student;
        const modal = await this.modalController.create({
          component: PgassessmentPage,
          componentProps: {
            res: {
              studentObj: student,
            },
          },
        });

        modal.onDidDismiss().then(() => {
          this.getallstudents(this._userid);
        });
        return await modal.present();
      }
    } else {
      // this.hblStudent = student;
      const modal = await this.modalController.create({
        component: HblAssessmentPage,
        componentProps: {
          res: {
            docid: student._id,
            userid: student.userid,
            username: student.username,
            studentid: student.studentid,
            studentname: student.studentname,
            program: student.program,
            class: student.class,
            gender: student.gender,
            phone: student.phone,
            school: student.school,
            parentsname: student.parentsname,
            dob: student.dob,
          },
        },
      });

      modal.onDidDismiss().then(() => {
        this.getallstudents(this._userid);
      });
      return await modal.present();
    }
  }

  async fillResponse(studentdata) {
    console.log("check school", studentdata.school);

    let dt = new Date();
    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yr = new Date().getFullYear();
    let fullDt = dd + "/" + mm + "/" + yr;
    let schoolName;
    let schoolid = "tz123";
    if (studentdata.school == undefined || studentdata.school == "") {
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
          schoolname: schoolName,
          schoolid: schoolid,
          udise: schoolid,
          phoneno: studentdata.phone,
          calledon: dt,
          fullDate: fullDt,
          passcode: this.passcode,
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

  closeOpened() {
    this.close = !this.close;
  }

  setlevel_ec_onchange(value) {
    this.selected_ec_level = value;
  }

  setlevel_pg_math_onchange(value) {
    this.selected_math_level = value;
  }

  setlevel_pg_eng_onchange(value) {
    this.selected_eng_level = value;
  }

  setlevel_pg_odia_onchange(value) {
    this.selected_odia_level = value;
  }

  /* Condition for set level
      if PGE: directly set new level
      if ECE: go to base line page (as previously done)
  */

  async openModal2(subject, student) {
    if (subject === "" || subject === "na") {
      this.selected_level = student.ece.val;
    } else if (subject === "math") {
      this.selected_level = student.math.val;
    } else if (subject === "english") {
      this.selected_level = student.english.val;
    } else if (subject === "odia") {
      this.selected_level = student.odia.val;
    }

    let prgm = student.program;

    if (prgm === "pge") {
      // show confirmation
      const alert = await this.alertController.create({
        header: "Change level",
        subHeader: "",
        message: "Are you sure. You want to change the level.",
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
              this.setPGELevel(student._id, subject, this.selected_level);
            },
          },
        ],
      });
      await alert.present();
    } else {
      const modal = await this.modalController.create({
        component: BaselinePage,
        componentProps: {
          res: student,
          subject: subject,
          selected_level: this.selected_level,
        }, // <-- this is used to pass data from  this page to the modal page that will open on click
      });
      modal.onDidDismiss().then((data) => {
        this.getallstudents(this._userid); // <-- here is data received back from the modal page
      });
      return await modal.present();
    }
  }

  // set pge level

  async setPGELevel(_id, newsubject, newlevel) {
    const data = {
      detailsid: _id,
      subject: newsubject,
      level: newlevel,
      baselinetest: null,
      baselinetestresult: null,
    };

    //this.student_list.forEach(student => {
    for (var s = 0; s < (this.student_list || []).length; s++) {
      if (this.student_list[s]._id == _id) {
        if (newsubject == "math") {
          this.student_list[s].isShowMath = false;
          this.student_list[s].math.hidden = !this.student_list[s].math.hidden;
          this.student_list[s].math.val = this.student_list[s].math_level;
        } else if (newsubject == "english") {
          this.student_list[s].isShowEng = false;
          this.student_list[s].english.hidden =
            !this.student_list[s].english.hidden;
          this.student_list[s].english.val = this.student_list[s].english_level;
        } else if (newsubject == "odia") {
          this.student_list[s].isShowOdia = false;
          this.student_list[s].odia.hidden = !this.student_list[s].odia.hidden;
          this.student_list[s].odia.val = this.student_list[s].odia_level;
        } else if (newsubject == "ece") {
          this.student_list[s].isShowEce = false;
          this.student_list[s].ece.hidden = !this.student_list[s].ece.hidden;
          this.student_list[s].ece.val = this.student_list[s].ec_level;
        }
      }
    }

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.setlevelbyid(data).subscribe(
      (res) => {
        this.updateLevelInStudentDetail(_id, newsubject, newlevel);
        loading.dismiss();
        if (res["status"] == "success") {
          // this.showAlert('Set Level', '', 'Student level set Successfully');
        } else {
          // this.showAlert('Set Level', '', 'Student level set ' + res['status'] + ' !!!');
        }
        // this.showAlert('Set Level', '', 'Student level set ' + res['status'] + ' !!!');
      },
      (err) => {
        loading.dismiss();
      }
    );
  }

  async updateLevelInStudentDetail(_id, newsubject, newlevel) {
    const id = _id;
    let data: any;
    if (newsubject === "" || newsubject === "na") {
      data = { ec_level: newlevel };
    } else if (newsubject === "math") {
      data = { math_level: newlevel };
    } else if (newsubject === "english") {
      data = { eng_level: newlevel };
    } else if (newsubject === "odia") {
      data = { odia_level: newlevel };
    }
    await this.api.updatelevelbyid(id, data).subscribe(
      (res) => {
        if (res.status === "success") {
          this.getallstudents(this._userid);
          this.showAlert(
            "Set Level",
            "",
            "The student's level set successfully"
          );
          // this.navController.navigateForward('/student');
        }
      },
      (err) => {
        // console.log(err);
      }
    );
  }

  async openModal(subject, student) {
    if (subject === "") {
      this.selected_level = this.selected_ec_level;
    } else if (subject === "math") {
      this.selected_level = this.selected_math_level;
    } else if (subject === "english") {
      this.selected_level = this.selected_eng_level;
    } else if (subject === "odia") {
      this.selected_level = this.selected_odia_level;
    } else {
      this.selected_level = "";
    }

    if (this.selected_level === "") {
      this.showAlert("Select Level", "", "Select level !!!");
    } else {
      const modal = await this.modalController.create({
        component: BaselinePage,
        componentProps: {
          res: student,
          subject: subject,
          selected_level: this.selected_level,
        }, // <-- this is used to pass data from  this page to the modal page that will open on click
      });
      modal.onDidDismiss().then((data) => {
        this.getallstudents(this._userid); // <-- here is data received back from the modal page
      });
      // this.updateMessageStatus(res);
      return await modal.present();
    }
  }

  async presentPopover(event) {
    const popover = await this.popoverCtrl.create({
      component: IconpopoverComponent,
      componentProps: {
        res: event,
      },
    });
    popover.onDidDismiss().then((data) => {
      if (data.data === "Cancel") this.getallstudents(this._userid); // <-- here is data received back from the modal page
    });
    return await popover.present();
  }

  async signUp() {
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

      const loading = await this.loadingController.create({ duration: 5000 });
      await loading.present();
      await this.api.registernewstudent(details).subscribe(
        (res) => {
          loading.dismiss();
          this.showAlert(
            "Student Registration",
            "",
            "Student registration " + res["status"] + " !!!"
          );
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
    }
  }

  checkStudentType(studentObj) {
    if (studentObj.studentcategory == "app") {
      this.open_register_modal(studentObj, "edit");
    } else if (studentObj.studentcategory == "hbl") {
      this.openHBLRegisterModal(studentObj, "edit");
    }
  }

  async open_register_modal(studentObj, flag) {
    const modal = await this.modalController.create({
      component: StudentregisterPage,
      componentProps: { res: { flag: flag, studentObj: studentObj } },
    });
    modal.onDidDismiss().then((data) => {
      this.getallstudents(this._userid);
    });
    return await modal.present();
  }

  async openHBLRegisterModal(studentObj, flag) {
    const modal = await this.modalController.create({
      component: HblRegisterPage,
      componentProps: { res: { flag: flag, studentObj: studentObj } },
    });
    modal.onDidDismiss().then((data) => {
      this.getallstudents(this._userid);
    });
    return await modal.present();
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

  delete_button_click(student) {
    const id = student._id;
    const studentname = student.studentname;
    this.showConfirm(
      this.del_msg_heading,
      "",
      this.del_msg1 + studentname + this.del_msg2,
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

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }

  flipStudentDisplay(student) {
    // student.math.hidden==true && student.math.val==student.math_level
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
        element.isShowEng = true;
        element.isShowMath = true;
        element.isShowOdia = true;
        element.isShowEce = true;

        if (element.baselinedetails) {
          element.baselinedetails.forEach((baseline) => {
            if (baseline.detailsid == student._id) {
              if (baseline.level == element.eng_level) {
                element.isShowEng = false;
              }
              if (baseline.level == element.math_level) {
                element.isShowMath = false;
              }
              if (baseline.level == element.odia_level) {
                element.isShowOdia = false;
              }
              if (baseline.level == element.ec_level) {
                element.isShowEce = false;
              }
            }
          });
        }
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
      setTimeout(() => {
        if (!student.hidden) {
          document.getElementById("eceElement" + student.studentid).focus();
          document
            .getElementById("eceElement" + student.studentid)
            .scrollIntoView(false);
        }
      }, 1000);
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

  addNewStudent() {
    this.navController.navigateForward("/student");
  }

  skillchartall1_button_click() {
    this.navController.navigateForward("/skillchartall1");
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

  clearAll(id) {
    this.student_list.forEach((element) => {
      if (element.studentid != id) this.showAction[element.studentid] = false;
    });
  }

  navigate_assessment(studentObj) {
    //this.navController.navigateForward('/studentassessment1/'+studentObj);
    let navigationExtras: NavigationExtras = {
      state: {
        studentObj: studentObj,
      },
    };
    this.router.navigate(["studentdetails"], navigationExtras);
  }

  focusLevel(id) {
    setTimeout(() => {
      document.getElementById("levelElement" + id).focus();
      document.getElementById("levelElement" + id).scrollIntoView(false);
    }, 1000);
  }

  focusLevelPge(id, lang) {
    setTimeout(() => {
      document.getElementById("levelElement" + lang + id).focus();
      document.getElementById("levelElement" + lang + id).scrollIntoView(false);
    }, 1000);
  }
}
