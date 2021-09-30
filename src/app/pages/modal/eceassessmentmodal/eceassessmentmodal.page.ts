import { Component, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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

// Modals
import { RestApiService } from "./../../../rest-api.service";

import { TranslateService } from "@ngx-translate/core";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-eceassessmentmodal",
  templateUrl: "./eceassessmentmodal.page.html",
  styleUrls: ["./eceassessmentmodal.page.scss"],
})
export class EceassessmentmodalPage {
  answerList: any = {};
  assessment_list: any = [];
  assessmenttest: any = [];
  public makepaymentFormGroup: FormGroup;
  amount: string = "";
  remark: string = "";
  isAssessmentTaken: boolean = false;
  assessmentTestRecords: any = [];
  isProgramPGE: boolean = false;
  isProgramECE: boolean = false;

  res: any;
  preferedlanguage: string;
  docid: string;
  userid: string;
  username: string;
  centerid: string;
  centername: string;
  studentid: string;
  studentname: string;
  program: string = "";
  level: string = "";
  stage: string = "";
  subject: string = "";
  score: number = 0;
  subject_txt: string = "";
  math_txt: string = "";
  english_txt: string = "";
  odia_txt: string = "";
  baselinestatus: string = "";
  message: string = "";
  messageheading: string = "";
  msg_success: string = "";
  msg_head_noQues: string = "";
  msg_noQues: string = "";
  msg_completeQues: string = "";
  toolbarshadow: any;
  confirmBox_header: string = "";
  confirmBox_msg: string = "";
  confirmBox_ok: string = "";
  confirmBox_cancel: string = "";
  progressSaved: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    public navParams: NavParams,
    private translateService: TranslateService,
    private serverDownMsg: ServerDownService
  ) {
    this.makepaymentFormGroup = this.formBuilder.group({
      amount: ["", [Validators.required]],
      remark: ["", [Validators.required]],
    });

    //Translator variables
    this.messageheading = this.translateService.get("MESSAGE.messagehead")[
      "value"
    ];
    this.message = this.translateService.get("MESSAGE.message")["value"];
    this.msg_success = this.translateService.get("MESSAGE.msg_success")[
      "value"
    ];
    this.msg_head_noQues = this.translateService.get("HBLQUIZ.msg_head_noQues")[
      "value"
    ];
    this.msg_noQues = this.translateService.get("HBLQUIZ.msg_noQues")["value"];
    this.msg_completeQues = this.translateService.get(
      "HBLQUIZ.msg_completeQues"
    )["value"];
    this.math_txt = this.translateService.get("HBLQUIZ.math_txt")["value"];
    this.english_txt = this.translateService.get("HBLQUIZ.english_txt")[
      "value"
    ];
    this.odia_txt = this.translateService.get("HBLQUIZ.odia_txt")["value"];
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

    // modal parameters
    this.res = this.navParams.data.res;
    console.log("CHECK DATA", this.res);

    this.preferedlanguage = this.res.preferedlanguage;
    this.docid = this.res.docid;
    this.userid = this.res.userid;
    this.username = this.res.username;
    this.studentid = this.res.studentid;
    this.studentname = this.res.studentname;
    this.program = this.res.program;
    this.level = this.res.level;
    this.stage = this.res.stage;
    this.subject = this.res.subject;

    this.preferedlanguage =
      this.preferedlanguage == undefined ||
      this.preferedlanguage == null ||
      this.preferedlanguage == ""
        ? localStorage.getItem("_language")
        : this.preferedlanguage;

    this.checkProgram();
    this.translateSubjectText();
    this.gettchassessmenttest();
  }

  checkProgram() {
    if (this.program == "pge") {
      this.isProgramPGE = true;
      this.isProgramECE = false;
    } else if (this.program == "ece") {
      this.isProgramECE = true;
      this.isProgramPGE = false;
    }
  }

  translateSubjectText() {
    if (this.subject == "math") {
      this.subject_txt = this.math_txt;
    } else if (this.subject == "english") {
      this.subject_txt = this.english_txt;
    } else if (this.subject == "odia") {
      this.subject_txt = this.odia_txt;
    }
  }

  checkQuizStatus() {
    if (this.progressSaved == false) {
      this.confirmBox(this.confirmBox_header, "", this.confirmBox_msg);
    } else {
      this.closeModal();
    }
  }

  // get tch assessment test records
  // get tch assessment
  async gettchassessmenttest() {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .gettchassessmenttest(
        this.studentid,
        this.program,
        this.level,
        this.stage,
        this.subject
      )
      .subscribe(
        (res) => {
          if (res.length > 0) {
            this.isAssessmentTaken = true;
            this.assessmentTestRecords = res;
            alert("Assessment already submitted");
          } else {
            this.isAssessmentTaken = false;
            if (this.stage != "month0" && this.program == "pge") {
              this.checkBaselineStatusPGE(
                this.docid,
                this.studentid,
                this.program,
                this.stage,
                this.subject
              );
            } else if (this.stage != "quarter0" && this.program == "ece") {
              this.checkBaselineStatusECE(
                this.docid,
                this.studentid,
                this.program,
                this.stage
              );
            } else {
              this.gettchassessment();
            }
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  async checkBaselineStatusPGE(
    docid,
    studentid,
    program,
    selected_month,
    selected_subject
  ) {
    const data = {
      studentid: studentid,
      program: program,
      stage: "month0",
      selected_subject: ["math", "english", "odia"],
    };
    await this.api.gettchassessmenttest_allsubject(data).subscribe(
      async (res) => {
        if (res.length == 3) {
          // this.updateBaselineStatus(docid);
          this.gettchassessment();
        } else {
          //progressSaved set to true beacause if baseln not given progressSaved popup appears
          this.progressSaved = true;
          this.showConfirm(this.messageheading, this.message);
        }
      },
      (err) => {
        // console.log(err);
        this.serverDownMsg.presentToast();
      }
    );
  }

  async checkBaselineStatusECE(docid, studentid, program, selected_month) {
    const data = {
      studentid: studentid,
      program: program,
      stage: "quarter0",
    };
    await this.api.gettchassessmenttest_allsubject_ece(data).subscribe(
      (res) => {
        if (res.length == 0) {
          //progressSaved set to true beacause if baseln not given progressSaved popup appears
          this.progressSaved = true;
          this.showConfirm(this.messageheading, this.message);
        } else {
          // this.updateBaselineStatus(this.docid);
          this.gettchassessment();
        }
      },
      (err) => {
        // console.log(err);
        this.serverDownMsg.presentToast();
      }
    );
  }

  async setBaselineStatus(docid, studentid, program) {
    console.log("setbaseln", docid, studentid, program);
    if (program == "pge") {
      const data = {
        studentid: studentid,
        program: program,
        stage: "month0",
        selected_subject: ["math", "english", "odia"],
      };
      await this.api.gettchassessmenttest_allsubject(data).subscribe(
        async (res) => {
          console.log("check reslength", res.length);
          if (res.length == 3) {
            this.updateBaselineStatus(docid);
          } else {
          }
        },
        (err) => {
          console.log(err);
          this.serverDownMsg.presentToast();
        }
      );
    } else if (program == "ece") {
      const data = {
        studentid: studentid,
        program: program,
        stage: "quarter0",
      };
      await this.api.gettchassessmenttest_allsubject_ece(data).subscribe(
        (res) => {
          if (res.length == 0) {
          } else {
            this.updateBaselineStatus(this.docid);
          }
        },
        (err) => {
          console.log(err);
          this.serverDownMsg.presentToast();
        }
      );
    }
  }

  async updateBaselineStatus(docid) {
    const data = {
      mainbaselinestatus: "complete",
    };
    await this.api.updatestudent(docid, data).subscribe(
      (res) => {
        console.log("updatebaseln status", res.status);
      },
      (err) => {
        console.log(err);
        this.serverDownMsg.presentToast();
      }
    );
  }

  // get tch assessment
  async gettchassessment() {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .gettchassessment(
        this.preferedlanguage,
        this.program,
        this.level,
        this.stage,
        this.subject
      )
      .subscribe(
        (res) => {
          // console.log("check ques", res);
          this.assessment_list = res;
          if (this.assessment_list.length != 0) {
            //do something
          } else {
            this.showConfirm(this.msg_head_noQues, this.msg_noQues);
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  // yes or no clicked
  segmentChanged(assessment, value) {
    this.answerList[assessment.id] = value;
    const assessment_id = assessment._id;
    const question_id = assessment.id;
    const question = assessment.question;
    const answer = value;
    if (answer == "yes") {
      this.score++;
    }
    this.add_to_attendancelist(assessment_id, question_id, question, answer);
  }

  // add to attendance list
  add_to_attendancelist(assessment_id, question_id, question, answer) {
    const obj = {
      assessment_id: assessment_id,
      id: question_id,
      question: question,
      answer: answer,
    };

    if (this.assessmenttest.length > 0) {
      // check for record exist or not
      let i = 0,
        index = -1;
      this.assessmenttest.forEach((element) => {
        if (element.assessment_id == assessment_id) {
          index = i;
          return;
        }
        i++;
      });
      if (index >= 0) {
        this.assessmenttest.splice(index, 1, obj);
      } else {
        this.assessmenttest.push(obj);
      }
    } else {
      this.assessmenttest.push(obj);
    }
  }

  // save attendance
  async save_assessment() {
    const data = {
      userid: this.userid,
      username: this.username,
      studentid: this.studentid,
      studentname: this.studentname,
      program: this.program,
      level: this.level,
      stage: this.stage,
      subject: this.subject,
      assessmenttest: this.assessmenttest,
      score: this.score,
    };

    if (this.assessment_list.length != this.assessmenttest.length) {
      this.showAlert(this.messageheading, "", this.msg_completeQues);
    } else {
      this.save(data);
    }
  }

  async save(data) {
    console.log("i am here", data);
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.createtchassessmenttest(data).subscribe(
      (res) => {
        if (res["status"]) {
          this.showAlert(this.messageheading, "", this.msg_success);
        }
        loading.dismiss();
        this.modalController.dismiss({ data: "Ok" });
        this.setBaselineStatus(this.docid, this.studentid, this.program);
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
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
  async showConfirm(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.closeModal();
          },
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
            this.closeModal();
          },
        },
      ],
    });
    await alert.present();
  }

  // close modal
  closeModal() {
    this.modalController.dismiss({ data: "Cancel" });
  }
}
