import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { TranslateService } from "@ngx-translate/core";
import {
  AlertController,
  ModalController,
  LoadingController,
  NavController,
  Platform,
} from "@ionic/angular";
import { RestApiService } from "../rest-api.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ServerDownService } from "../services/server-down.service";
@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.page.html",
  styleUrls: ["./quiz.page.scss"],
})
export class QuizPage implements OnInit {
  // quiz;
  qno = 1;
  disable_submit_button: boolean = true;
  submitButton;
  submitButtonText;
  score;
  totalScore;
  trainingobj: any = {};
  content = "";
  worksheet: any = [];
  video: any = [];
  image: any = [];
  quiz: any;
  minutes: any;
  seconds: any;
  toolbarshadow = true;
  // totalSeconds:number = 0;
  isVisited_content = false;
  isVisited_video = false;
  isVisited_worksheet = false;
  isVisited_image = false;
  isVisited_quiz = false;

  disable_radio: boolean = false;
  disable_next_button: boolean = true;
  user_quiz: any = [];
  secured_mark: number = 0;
  total_mark: number = 0;
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  startTime: Date;
  stopTime: Date;
  active: boolean = false;
  showTimer: boolean = false;
  language: string;
  get display() {
    return this.startTime && this.stopTime
      ? +this.stopTime - +this.startTime
      : 0;
  }
  moduleid: any;
  topicid: any;
  submoduleid: any;
  quizstatus: Boolean = false;
  modulename: any;
  submodulename: any;
  topicname: any;
  success_message: string = "";
  confirmBox_header: string = "";
  confirmBox_msg: string = "";
  confirmBox_ok: string = "";
  confirmBox_cancel: string = "";
  progressSaved: boolean = false;
  @ViewChild("slides") slides;
  constructor(
    public navController: NavController,
    public dataServ: DataService,
    public modalCtrl: ModalController,
    private translateService: TranslateService,
    public api: RestApiService,
    private loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform,
    private serverDownMsg: ServerDownService
  ) {
    this.success_message = this.translateService.get("PPT.success_message")[
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
    this.startTime = new Date();
    this.timer();
    this.showTimer = true;
    //  setInterval(this.startTimer, 1000);
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";
    this.language = localStorage.getItem("_language");
    this.route.queryParams.subscribe((params) => {
      if (
        params.parameters == undefined ||
        params.parameters.quiz.length == 0
      ) {
        this.quizstatus = true;
      } else {
        this.quizstatus = false;
        this.quiz = params.parameters.quiz;
        this.moduleid = params.parameters.moduleid;
        this.modulename = params.parameters.modulename;
        this.submodulename = params.parameters.submodulename;
        this.submoduleid = params.parameters.submoduleid;
        this.topicid = params.parameters.topicid;
        this.quiz =
          this.quiz == undefined || this.quiz == null ? [] : this.quiz;
        this.total_mark = this.quiz.length;
        let count = 1;
        this.quiz.forEach(function (value, index) {
          value.selectedOption = 0;
        });
        this.getTchTraaining_status(
          this._userid,
          this.moduleid,
          this.submoduleid,
          this.topicid
        );
      }
    });

    //--->>>Commented due to device back btn issue<<<---
    // this.platform.backButton.subscribeWithPriority(-1, () => {
    //   this.checkQuizStatus();
    // });
  }

  checkQuizStatus() {
    if (this.progressSaved == false) {
      this.confirmBox(this.confirmBox_header, "", this.confirmBox_msg);
    } else {
      this.calltoroot();
    }
  }

  save_operation: any;
  async getTchTraaining_status(uid, mid, sid, tid) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.gettopicdetails(uid, mid, sid, tid).subscribe(
      (res) => {
        if (res.length > 0) {
          this.save_operation = "update";
        } else {
          this.save_operation = "save";
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }
  timer() {
    this.stopTime = new Date();
    setTimeout(() => {
      this.timer();
    }, 1000);
  }
  ngOnInit() {
    //  this.slides.lockSwipes(true);
  }

  slideChanged(event) {
    this.slides.getActiveIndex().then((index) => {
      this.qno = index + 1;
    });
  }

  enable_save_button: boolean = false;
  move(n: number) {
    this.slides.slideNext();
    this.disable_radio = false;
    this.disable_next_button = true;
    this.slides.getActiveIndex().then((index) => {
      this.qno = index + 1;
    });
    this.slides.isEnd().then((value) => {
      this.disable_submit_button = true;
      this.enable_save_button = value ? true : false;
      if (this.enable_save_button == true) {
        this.submitButton = true;
        this.disable_next_button = true;
        this.submitButtonText =
          this.translateService.get("PPT.submit")["value"];
        this.showTimer = false;
        var startMinutes = this.startTime.getMinutes();
        var startSeconds = this.startTime.getSeconds();
        var endMinutes = this.stopTime.getMinutes();
        var endSeconds = this.stopTime.getSeconds();
        this.diff(
          startMinutes + ":" + startSeconds,
          endMinutes + ":" + endSeconds
        );
      } else {
        // this.disable_next_button = false;
      }
    });
    // this.disable_radio = false;
    // this.disable_next_button = false;
    // if (this.slides == null) {
    //   alert('null');
    // } else {
    //   if (n > 0 && this.qno !== this.quiz.length) {
    //     // this.slides.lockSwipes(false);
    //     this.slides.slideNext();
    //     // this.slides.lockSwipes(true);
    //     this.qno++;
    //   } else if (n < 0 && this.qno !== 1) {
    //     // this.slides.lockSwipes(false);
    //     this.slides.slidePrev();
    //     // this.slides.lockSwipes(true);
    //     this.qno--;
    //   } else {
    //   }
    // }
  }

  ngAfterViewInit() {}

  logData(data) {
    let count = 0;
    // this.quiz.forEach(element => {
    //   if (element.selectedOption !== 0 && typeof(element.selectedOption) != 'undefined') {
    //     count++;
    if (data.selectedOption == data.answer) {
      this.disable_submit_button = false;
      this.disable_radio = true;
      this.disable_next_button = true;
      this.calculate_total_mark(data.qid, data);
      this.showAlert(
        "Correct option:",
        "",
        "<h1><center>" + data.answer + "</center></h1>"
      );
      // this.move(1);
    } else {
      count++;
      this.showAlert(
        "Correct option:",
        "",
        "<h1><center>" + data.answer + "</center></h1>"
      );
      // this.move(1);
      this.disable_radio = true;
      this.disable_next_button = false;
      this.disable_submit_button = false;
    }
    //   }
    // });
    if (count === this.quiz.length) {
      this.disable_submit_button = true;
      this.submitButton = true;
      this.submitButtonText = "Complete Quiz";
      var startMinutes = this.startTime.getMinutes();
      var startSeconds = this.startTime.getSeconds();
      var endMinutes = this.stopTime.getMinutes();
      var endSeconds = this.stopTime.getSeconds();
      this.diff(
        startMinutes + ":" + startSeconds,
        endMinutes + ":" + endSeconds
      );
    }
  }
  timeTaken: any;
  diff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    var result =
      (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
    this.timeTaken = result;
  }

  calculate_total_mark(quid, quizObj) {
    if (!this.user_quiz.some((item) => item.qid == quid)) {
      this.secured_mark =
        quizObj.answer === quizObj.selectedOption
          ? this.secured_mark + 1
          : this.secured_mark;
      this.user_quiz.push(quizObj);
    }
  }

  async finishQuiz() {
    this.showTimer = false;
    this.totalScore = this.quiz.length;
    this.score = 0;
    this.quiz.forEach((element) => {
      if (element.selectedOption === element.answer) {
        this.score += 1;
      }
    });
    // this.showAlert('Score Details', '', '<p>Secured Mark:'+this.secured_mark+'</p></br><p>Total Mark:'+this.total_mark+'</p></br><p>Time Duration:'+this.timeTaken+'</p>');

    if (this.save_operation == "save") {
      this.saveStatus();
    } else {
      const data = {
        totalmark: this.total_mark,
        quiz: this.quiz,
        quiz_status: true,
        score: this.score,
        topic_percentage: "100%",
        language: this.language,
        quiz_completion_time: this.timeTaken,
      };
      await this.api
        .updatetchtraining(this._userid, this.moduleid, this.topicid, data)
        .subscribe(
          (res) => {
            if (res.status == "success") {
              this.progressSaved = true;
              this.navController.navigateBack("trainingcontent");
              // this.showConfirm(this.score, this.total_mark, this.timeTaken);
              this.submitButton = false;
              this.disable_radio = true;
            }
          },
          (err) => {
            console.log("@@@ERROR-->>");
            this.serverDownMsg.presentToast();
          }
        );
    }
  }
  async saveStatus() {
    const body = {
      userid: this._userid,
      username: this._username,
      moduleid: this.moduleid,
      modulename: this.modulename,
      submoduleid: this.submoduleid,
      submodulename: this.submodulename,
      content: "",
      content_status: false,
      worksheet: "",
      worksheet_status: true,
      video: "",
      video_status: false,
      quiz: this.quiz,
      topicid: this.topicid,
      topicname: this.topicname,
      topic_percentage: "50%",
      totalmark: this.total_mark,
      quiz_status: true,
      score: this.secured_mark,
      language: this.language,
    };
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.savetchtraining(body).subscribe(
      (res) => {
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async showConfirm(secured_mark, total_mark, timeTaken) {
    const alert = await this.alertController.create({
      header: this.success_message,
      subHeader: "",
      message:
        "Secured Mark:" +
        secured_mark +
        "</br>" +
        "Total Mark:" +
        total_mark +
        "</br>" +
        "Time Duration:" +
        timeTaken,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.navController.navigateRoot("trainingcontent");
          },
        },
      ],
    });
    await alert.present();
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
            this.calltoroot();
          },
        },
      ],
    });
    await alert.present();
  }

  calltoroot() {
    this.navController.navigateBack("/trainingcontent");
  }
}
