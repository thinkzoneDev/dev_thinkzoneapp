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
import { EceassessmentmodalPage } from "./../modal/eceassessmentmodal/eceassessmentmodal.page";
import { TranslateService } from "@ngx-translate/core";
import { RestApiService } from "./../../rest-api.service";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-ecassessment",
  templateUrl: "./ecassessment.page.html",
  styleUrls: ["./ecassessment.page.scss"],
})
export class EcassessmentPage {
  selected_quarter = "";
  disable_fillmarks_button = true;
  month_diff: number;
  userobj: any = {};
  userreg_date = "";
  student_list: any = [];
  student_list_bkp: any = [];
  quarter_list: any[] = [];

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  toolbarshadow = true;

  lbl_quarter0: string = "";
  lbl_quarter1: string = "";
  lbl_quarter2: string = "";
  lbl_quarter3: string = "";
  lbl_quarter4: string = "";
  msg: string = "";
  msg_heading: string = "";
  msg_info: string = "";
  msg1: string = "";

  value: any;
  submmitButton: boolean = false;
  response_data: any;
  studentDetails: any;
  name: any;
  category: any;
  program: any;
  phone: any;
  gender: any;
  studentData: any;

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
    private route: ActivatedRoute,
    public navParams: NavParams,
    private serverDownMsg: ServerDownService
  ) {
    // this.route.queryParams.subscribe((params) => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.studentDetails =
    //       this.router.getCurrentNavigation().extras.state.studentObj;

    //     const { studentname, studentcategory, program, phone, gender } =
    //       this.studentDetails;
    //     this.name = studentname;
    //     this.category = studentcategory;
    //     this.program = program;
    //     this.phone = phone;
    //     this.gender = gender;
    //   }
    // });

    this.studentData = this.navParams.data.res;
    console.log("res-->", this.studentData);

    this.lbl_quarter0 = this.translateService.get("ASSESSMENT.quarter0")[
      "value"
    ];
    this.lbl_quarter1 = this.translateService.get("ASSESSMENT.quarter1")[
      "value"
    ];
    this.lbl_quarter2 = this.translateService.get("ASSESSMENT.quarter2")[
      "value"
    ];
    this.lbl_quarter3 = this.translateService.get("ASSESSMENT.quarter3")[
      "value"
    ];
    this.lbl_quarter4 = this.translateService.get("ASSESSMENT.quarter4")[
      "value"
    ];
    this.msg = this.translateService.get("ASSESSMENT.msg")["value"];
    this.msg_heading = this.translateService.get("ASSESSMENT.msg_heading")[
      "value"
    ];
    this.msg_info = this.translateService.get("ASSESSMENT.msg_info")["value"];
    this.msg1 = this.translateService.get("ASSESSMENT.msg1")["value"];

    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";

    this.getuserbyid(this._userid);
    //   this.getallstudentbyteacher();
  }

  // get student list
  async getallstudentbyteacher() {
    const studentcategory = "app";
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .getallstudentsbystudentcategory(this._userid, studentcategory)
      .subscribe(
        (res) => {
          res.forEach((element) => {
            if (element.program === "ece") {
              this.student_list.push(element);
            }
          });

          if (this.student_list == "") {
            this.showAlert(this.msg_heading, "", this.msg);
          } else {
            if (this.student_list.length > 0) {
              this.student_list.forEach((value) => {
                // if (value.baselinedetails.length == 3) {
                //   // this.month_list.forEach((value) => {
                //   //     value.disable == true;
                //   // });
                //   value.isBaselineTaken = true;
                // } else {
                //   value.isBaselineTaken = false;
                // }
              });
            }
          }
          // this.format_student_list(res);
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  async getuserbyid(userid) {
    console.log("userid", userid);

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getuserbyuserid(userid).subscribe(
      (res) => {
        console.log("user res", res);

        res = res == undefined || res == null ? [] : res;
        if (res.length > 0) {
          this.userobj = res[0];
          this.userreg_date = res[0].createdon;
        }
        this.calculateQuarter(new Date(this.userreg_date), new Date());
        // this.calculateQuarter(new Date(2018,11,11), new Date(2019,5,7));
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  calculateQuarter(fromDate, toDate) {
    console.log("cal quarter", fromDate, toDate);

    // month difference
    let months =
      toDate.getMonth() -
      fromDate.getMonth() +
      12 * (toDate.getFullYear() - fromDate.getFullYear()) +
      1;
    if (toDate.getDate() < fromDate.getDate()) {
      months--;
    }
    this.month_diff = months;

    // make mont_diff a +ve number
    this.month_diff =
      this.month_diff < 0 ? this.month_diff * -1 : this.month_diff;

    // create quarter list
    if (this.month_diff >= 1 && this.month_diff <= 3) {
      const q0 = {
        value: "quarter0",
        text: this.lbl_quarter0,
        disabled: false,
      };
      const q1 = {
        value: "quarter1",
        text: this.lbl_quarter1,
        disabled: false,
      };
      const q2 = {
        value: "quarter2",
        text: this.lbl_quarter2,
        disabled: false,
      };
      const q3 = {
        value: "quarter3",
        text: this.lbl_quarter3,
        disabled: false,
      };
      const q4 = {
        value: "quarter4",
        text: this.lbl_quarter4,
        disabled: false,
      };
      this.quarter_list = [];
      this.quarter_list.push(q0);
      this.quarter_list.push(q1);
      this.quarter_list.push(q2);
      this.quarter_list.push(q3);
      this.quarter_list.push(q4);
    } else if (this.month_diff >= 4 && this.month_diff <= 6) {
      const q0 = {
        value: "quarter0",
        text: this.lbl_quarter0,
        disabled: false,
      };
      const q1 = {
        value: "quarter1",
        text: this.lbl_quarter1,
        disabled: false,
      };
      const q2 = {
        value: "quarter2",
        text: this.lbl_quarter2,
        disabled: false,
      };
      const q3 = {
        value: "quarter3",
        text: this.lbl_quarter3,
        disabled: false,
      };
      const q4 = {
        value: "quarter4",
        text: this.lbl_quarter4,
        disabled: false,
      };
      this.quarter_list = [];
      this.quarter_list.push(q0);
      this.quarter_list.push(q1);
      this.quarter_list.push(q2);
      this.quarter_list.push(q3);
      this.quarter_list.push(q4);
    } else if (this.month_diff >= 7 && this.month_diff <= 9) {
      const q0 = {
        value: "quarter0",
        text: this.lbl_quarter0,
        disabled: false,
      };
      const q1 = {
        value: "quarter1",
        text: this.lbl_quarter1,
        disabled: false,
      };
      const q2 = {
        value: "quarter2",
        text: this.lbl_quarter2,
        disabled: false,
      };
      const q3 = {
        value: "quarter3",
        text: this.lbl_quarter3,
        disabled: false,
      };
      const q4 = {
        value: "quarter4",
        text: this.lbl_quarter4,
        disabled: false,
      };
      this.quarter_list = [];
      this.quarter_list.push(q0);
      this.quarter_list.push(q1);
      this.quarter_list.push(q2);
      this.quarter_list.push(q3);
      this.quarter_list.push(q4);
    } else if (this.month_diff >= 10 && this.month_diff <= 12) {
      const q0 = {
        value: "quarter0",
        text: this.lbl_quarter0,
        disabled: false,
      };
      const q1 = {
        value: "quarter1",
        text: this.lbl_quarter1,
        disabled: false,
      };
      const q2 = {
        value: "quarter2",
        text: this.lbl_quarter2,
        disabled: false,
      };
      const q3 = {
        value: "quarter3",
        text: this.lbl_quarter3,
        disabled: false,
      };
      const q4 = {
        value: "quarter4",
        text: this.lbl_quarter4,
        disabled: false,
      };
      this.quarter_list = [];
      this.quarter_list.push(q0);
      this.quarter_list.push(q1);
      this.quarter_list.push(q2);
      this.quarter_list.push(q3);
      this.quarter_list.push(q4);
    } else {
      const q0 = {
        value: "quarter0",
        text: this.lbl_quarter0,
        disabled: false,
      };
      const q1 = {
        value: "quarter1",
        text: this.lbl_quarter1,
        disabled: false,
      };
      const q2 = {
        value: "quarter2",
        text: this.lbl_quarter2,
        disabled: false,
      };
      const q3 = {
        value: "quarter3",
        text: this.lbl_quarter3,
        disabled: false,
      };
      const q4 = {
        value: "quarter4",
        text: this.lbl_quarter4,
        disabled: false,
      };
      this.quarter_list = [];
      this.quarter_list.push(q0);
      this.quarter_list.push(q1);
      this.quarter_list.push(q2);
      this.quarter_list.push(q3);
      this.quarter_list.push(q4);
    }
    let temp = [];
    this.quarter_list.forEach((element) => {
      if (!element.disabled) {
        temp.push(element);
      }
    });
    this.quarter_list = temp;
  }

  // quarter on change event
  quarter_onchange(value) {
    console.log("quarter_onchange", value);

    this.selected_quarter = value;
    if (this.selected_quarter.length > 0) {
      this.disable_fillmarks_button = false;
      this.quarterchange(value);
    } else {
      this.disable_fillmarks_button = true;
    }
  }

  student_list_assessment_yes: any = [];
  student_list_assessment_no: any = [];

  async quarterchange(quarter) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .getallstudentswithassessmentsquarterwisebyteacher(
        this._userid,
        "ece",
        quarter
      )
      .subscribe(
        (res) => {
          console.log("res---->", res);

          res = res == undefined || res == null ? [] : res;
          if (Object.keys(res).length > 0) {
            this.student_list_assessment_yes = res["student_assessment_yes"];
            this.student_list_assessment_no = res["student_assessment_no"];
            this.ece_fillmarks_btnclick(this.studentData);
          } else {
            this.student_list_assessment_yes = [];
            this.student_list_assessment_no = [];
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  view_assessment_btnclick(studentObj) {
    //this.navController.navigateForward('/studentassessment1/'+studentObj);
    let navigationExtras: NavigationExtras = {
      state: {
        studentObj: studentObj,
      },
    };
    this.router.navigate(["studentassessment1"], navigationExtras);
  }

  async ece_fillmarks_btnclick(slist) {
    console.log("check student", slist, this.selected_quarter);
    await this.api
      .gettchassessmenttest(
        slist.studentid,
        slist.program,
        slist.class,
        this.selected_quarter,
        "na"
      )
      .subscribe(
        async (res) => {
          if (res.length > 0) {
            this.showAlert(this.msg_info, "", this.msg1);
            // return alert("Assessment already submitted");
          } else {
            if (this.disable_fillmarks_button) {
              this.showAlert("Info", "", "please select a quarter first!");
              // alert("please select a quarter first!");
              return;
            }
            const modal = await this.modalController.create({
              component: EceassessmentmodalPage,
              componentProps: {
                res: {
                  docid: slist.docid,
                  userid: this._userid,
                  username: this._username,
                  studentid: slist.studentid,
                  studentname: slist.studentname,
                  program: slist.program,
                  level: slist.class,
                  stage: this.selected_quarter,
                  subject: "na",
                },
              },
            });
            modal.onDidDismiss().then((data) => {
              // this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
            });
            return await modal.present();
          }
        },
        (err) => {
          this.serverDownMsg.presentToast();
        }
      );
  }

  closeModal() {
    this.modalController.dismiss();
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

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
}
