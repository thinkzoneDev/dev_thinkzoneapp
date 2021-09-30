import { Router } from "@angular/router";
import { Component } from "@angular/core";
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
import { RestApiService } from "./../../rest-api.service";
import { TranslateService } from "@ngx-translate/core";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-hbl-quiz",
  templateUrl: "./hbl-quiz.page.html",
  styleUrls: ["./hbl-quiz.page.scss"],
})
export class HblQuizPage {
  toolbarshadow = true;
  answerList: any = {};
  assessment_list: any = [];
  assessmenttest: any = [];
  amount: string = "";
  remark: string = "";
  isAssessmentTaken: boolean = false;
  assessmentTestRecords: any = [];

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
  class: string = "";
  month: string = "";
  subject: string = "";
  gender: string = "";
  phone: any;
  school: string = "";
  parentsname: string = "";
  dob: any;
  no_question: boolean;
  selected_questionid: string = "";
  score: number = 0;

  message: string = "";
  messagehead: string = "";
  msg_success: string = "";
  msg_head_noQues: string = "";
  msg_noQues: string = "";
  msg_completeQues: string = "";
  baseline_txt: string = "";
  eceAct_txt: string = "";
  math_txt: string = "";
  english_txt: string = "";
  odia_txt: string = "";
  monthly_txt: string = "";
  endline_txt: string = "";
  subject_txt: string = "";
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
    private router: Router,
    private serverDownMsg: ServerDownService
  ) {
    //Transalator variables
    this.messagehead = this.translateService.get("MESSAGE.messagehead")[
      "value"
    ];
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
    this.baseline_txt = this.translateService.get("HBLQUIZ.baseline_txt")[
      "value"
    ];
    this.eceAct_txt = this.translateService.get("HBLQUIZ.eceAct_txt")["value"];
    this.math_txt = this.translateService.get("HBLQUIZ.math_txt")["value"];
    this.english_txt = this.translateService.get("HBLQUIZ.english_txt")[
      "value"
    ];
    this.odia_txt = this.translateService.get("HBLQUIZ.odia_txt")["value"];
    this.monthly_txt = this.translateService.get("HBLQUIZ.monthly_txt")[
      "value"
    ];
    this.endline_txt = this.translateService.get("HBLQUIZ.endline_txt")[
      "value"
    ];
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

    // modal paramiters
    this.res = this.navParams.data.res;
    this.preferedlanguage = this.res.preferedlanguage;
    this.docid = this.res.docid;
    this.userid = this.res.userid;
    this.username = this.res.username;
    this.studentid = this.res.studentid;
    this.studentname = this.res.studentname;
    this.gender = this.res.gender;
    this.parentsname = this.res.parentsname;
    this.dob = this.res.dob;
    this.class = this.res.class;
    this.school = this.res.school;
    this.month = this.res.month;
    this.subject = this.res.subject;
    this.phone = this.res.phone;

    this.preferedlanguage =
      this.preferedlanguage == undefined ||
      this.preferedlanguage == null ||
      this.preferedlanguage == ""
        ? localStorage.getItem("_language")
        : this.preferedlanguage;

    this.translateSubjectText();
    this.gethblassessmenttest();

    console.log("navparams data", this.res);
  }

  translateSubjectText() {
    if (this.subject == "baseline") {
      this.subject_txt = this.baseline_txt;
    } else if (this.subject == "eceActivity") {
      this.subject_txt = this.eceAct_txt;
    } else if (this.subject == "math") {
      this.subject_txt = this.math_txt;
    } else if (this.subject == "english") {
      this.subject_txt = this.english_txt;
    } else if (this.subject == "odia") {
      this.subject_txt = this.odia_txt;
    } else if (this.subject == "monthly") {
      this.subject_txt = this.monthly_txt;
    } else if (this.subject == "endline") {
      this.subject_txt = this.endline_txt;
    }
  }

  checkQuizStatus() {
    if (this.progressSaved == false) {
      this.confirmBox(this.confirmBox_header, "", this.confirmBox_msg);
    } else {
      this.closeModal();
    }
  }

  async gethblassessmenttest() {
    let studentid = this.studentid;
    let selected_class = this.class;
    let month = this.month;
    let subject = this.subject;

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .gethblassessment(studentid, selected_class, month, subject)
      .subscribe(
        (res) => {
          if (res.length > 0) {
            this.isAssessmentTaken = true;
            this.assessmentTestRecords = res;
          } else {
            this.isAssessmentTaken = false;
            this.gethblassessmentquestions();
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  async setBaselineStatus() {
    let month = "month0";
    let selected_subject = "baseline";

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .gethblassessment(this.studentid, this.class, month, selected_subject)
      .subscribe(
        (res) => {
          if (Object.keys(res).length > 0) {
            console.log("1docid", this.docid);

            this.updateBaselineStatus(this.docid);
          } else {
            //do something
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  async updateBaselineStatus(docid) {
    console.log("2docid", this.docid);

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

  async gethblassessmentquestions() {
    let subject = this.subject;
    let language = this.preferedlanguage;
    let selected_class = this.class;
    let month = this.month;

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .gethblassessmentquestion(subject, language, selected_class, month)
      .subscribe(
        (res) => {
          this.assessment_list = res;
          if (this.assessment_list.length != 0) {
            this.no_question = true;
          } else {
            this.no_question = false;
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
    this.answerList[assessment._id] = value;
    const assessment_id = assessment._id;
    const question_id = assessment.id;
    const question = assessment.question;
    const answer = value;
    if (answer == "yes") {
      this.score++;
    }
    this.keep_assessment_record(assessment_id, question_id, question, answer);
  }

  keep_assessment_record(assessment_id, question_id, question, answer) {
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

  async save_assessment() {
    const data = {
      userid: this.userid,
      username: this.username,
      studentid: this.studentid,
      studentname: this.studentname,
      gender: this.gender,
      dob: this.dob,
      parentsname: this.parentsname,
      class: this.class,
      school: this.school,
      phone: this.phone,
      subject: this.subject,
      month: this.month,
      assessmenttest: this.assessmenttest,
      score: this.score,
    };
    if (this.assessment_list.length != this.assessmenttest.length) {
      this.showAlert(this.messagehead, "", this.msg_completeQues);
    } else {
      this.save(data);
    }
  }

  async save(data) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.savehblassessmenttest(data).subscribe(
      (res) => {
        if (res["status"]) {
          this.showAlert(this.messagehead, "", this.msg_success);
        }
        loading.dismiss();
        this.progressSaved = true;
        this.modalController.dismiss({ data: "Ok" });
        this.setBaselineStatus();
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
