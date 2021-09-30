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
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { RestApiService } from "./../../rest-api.service";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-callresponse",
  templateUrl: "./callresponse.page.html",
  styleUrls: ["./callresponse.page.scss"],
})
export class CallresponsePage {
  language: any;
  res: any;
  userid: string;
  username: string;
  usertype: string;
  passcode: string;
  studentid: string;
  studentName: string;
  phoneno: string;
  program: string;
  class: string;
  subject: string;
  schoolname: string;
  schoolid: string;
  udise: string;
  calledon: string;
  date: string;
  feedback: string;

  questionsList: any = [];
  answerList: any = {};
  saveBtn: boolean;
  questions: any = [];
  toolbarshadow: any;
  msg_head_noQues: string = "";
  msg_noQues: string = "";
  messageheading: string = "";
  msg_completeQues: string = "";
  parents_responded: boolean;
  hide_div: boolean;
  confirmBox_header: string = "";
  confirmBox_msg: string = "";
  confirmBox_ok: string = "";
  confirmBox_cancel: string = "";
  progressSaved: boolean = false;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private serverDownMsg: ServerDownService
  ) {
    this.language = localStorage.getItem("_language");
    this.res = this.navParams.data.res;
    this.userid = this.res.userid;
    this.username = this.res.username;
    this.usertype = this.res.usertype;
    this.passcode = this.res.passcode;
    this.studentid = this.res.studentid;
    this.studentName = this.res.studentName;
    this.phoneno = this.res.phoneno;
    this.program = this.res.program;
    this.class = this.res.class;
    this.schoolname = this.res.schoolname;
    this.schoolid = this.res.schoolid;
    this.udise = this.res.udise;
    this.calledon = this.res.calledon;
    this.date = this.res.fullDate;

    this.parents_responded = false;
    this.hide_div = false;

    this.msg_head_noQues = this.translateService.get("HBLQUIZ.msg_noQues1")[
      "value"
    ];
    this.msg_noQues = this.translateService.get("HBLQUIZ.msg_noQues")["value"];
    this.messageheading = this.translateService.get("MESSAGE.messagehead")[
      "value"
    ];
    this.msg_completeQues = this.translateService.get(
      "HBLQUIZ.msg_completeQues"
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

    this.getfeedbackquestions(this.language, this.program);
    console.log("lang", this.language);
  }

  subjectOnChange(sub) {
    console.log("check subj", sub);
    this.subject = sub;
    //this.getfeedbackquestions();
  }

  yesClicked() {
    this.parents_responded = true;
    this.hide_div = true;
  }

  noClicked() {
    this.parents_responded = false;
    this.closeModal();
  }

  checkQuizStatus() {
    if (this.progressSaved == false) {
      this.confirmBox(this.confirmBox_header, "", this.confirmBox_msg);
    } else {
      this.closeModal();
    }
  }

  async getfeedbackquestions(language, program) {
    console.log("feedback ques data", language, program);

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getallpostcallquestions(language, program).subscribe(
      (res) => {
        console.log("check res", res);
        this.questionsList = res;
        if (this.questionsList.length == 0) {
          this.showConfirm(this.msg_head_noQues, this.msg_noQues);
          this.saveBtn = false;
        } else {
          this.saveBtn = true;
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  segmentChanged(questionlist, value) {
    this.answerList[questionlist._id] = value;
    const assessment_id = questionlist._id;
    const question_id = questionlist._id;
    const question = questionlist.question;
    const answer = value;
    this.keep_feedback_record(assessment_id, question_id, question, answer);
  }

  keep_feedback_record(assessment_id, question_id, question, answer) {
    const obj = {
      assessment_id: assessment_id,
      id: question_id,
      question: question,
      answer: answer,
    };

    if (this.questions.length > 0) {
      // check for record exist or not
      let i = 0,
        index = -1;
      this.questions.forEach((element) => {
        if (element.assessment_id == assessment_id) {
          index = i;
          return;
        }
        i++;
      });
      if (index >= 0) {
        this.questions.splice(index, 1, obj);
      } else {
        this.questions.push(obj);
      }
    } else {
      this.questions.push(obj);
    }
  }

  async save_feedback() {
    const data = {
      userid: this.userid,
      username: this.username,
      usertype: this.usertype,
      studentid: this.studentid,
      studentname: this.studentName,
      program: this.program,
      class: this.class,
      school: this.schoolname,
      schoolid: this.schoolid,
      udise: this.udise,
      //--->>>temporary fix as passcode field is not in server<<---
      passcode: null,
      phonenumber: this.phoneno,
      //subject: this.subject,
      calledon: this.calledon,
      date: this.date,
      feedback: this.questions,
    };
    if (this.questionsList.length != this.questions.length) {
      this.showAlert(this.messageheading, "", this.msg_completeQues);
    } else {
      this.save(data);
    }
  }

  async save(data) {
    console.log("save data", data);

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.savepostcallactivities(data).subscribe(
      (res) => {
        console.log("postcallsave", res);

        if (res["status"]) {
          // this.showAlert(this.messagehead, "", this.msg_success);
        }
        loading.dismiss();
        this.modalController.dismiss({ data: "Ok" });
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
      buttons: ["OK"],
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
