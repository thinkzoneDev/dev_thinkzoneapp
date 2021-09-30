import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../../services/data.service";
import {
  AlertController,
  ModalController,
  LoadingController,
  NavController,
  Platform,
} from "@ionic/angular";
import { RestApiService } from "../../rest-api.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { elementEnd } from "@angular/core/src/render3";
import { ServerDownService } from "src/app/services/server-down.service";
@Component({
  selector: "app-TeacherBaseline",
  templateUrl: "./teacherbaselinedndline.page.html",
  styleUrls: ["./teacherbaselinedndline.page.scss"],
})
export class TeacherBaselinePage implements OnInit {
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
  // totalSeconds:number = 0;
  toolbarshadow = true;
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
  category: any;
  math_category: number = 0;
  get display() {
    return this.startTime && this.stopTime
      ? +this.stopTime - +this.startTime
      : 0;
  }
  moduleid: any;
  topicid: any;
  submoduleid: any;
  quizstatus: Boolean = true;
  modulename: any;
  submodulename: any;
  topicname: any;
  _emailid: any;
  type: string;
  displaytext: string;
  info: string;
  baseline_msg: string;
  endline_msg: string;
  no_contents_found: any = "";
  page_title: any = "";
  odia_category: number = 0;
  eng_category: number = 0;
  pedagogy_category: number = 0;
  technology_category: number = 0;
  baseline_complete: boolean;
  baseline_marks: any;
  odiaMark: any;
  mathMark: any;
  engMark: any;
  technologyMark: any;
  pedagogyMark: any;
  odiaTotalQuestion: any;
  mathTotalQuestion: any;
  engTotalQuestion: any;
  technologyTotalQuestion: any;
  pedagogyTotalQuestion: any;
  message_div: boolean;
  confirmBox_header: string = "";
  confirmBox_msg: string = "";
  confirmBox_ok: string = "";
  confirmBox_cancel: string = "";
  progressSaved: boolean = false;

  @ViewChild("slides") slides: IonSlides;
  slideOpts = {
    effect: "cube",
    noSwiping: true,
    initialSlide: 0,
    centeredSlides: true,
    loop: false,
    pager: false,
    slidesPerView: 1,
    autoplay: false,
    spaceBetween: 10,
    allowTouchMove: false,
  };

  constructor(
    public navController: NavController,
    public dataServ: DataService,
    public modalCtrl: ModalController,
    public api: RestApiService,
    private loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private platform: Platform,
    private serverDownMsg: ServerDownService
  ) {
    this.startTime = new Date();
    this.timer();
    this.showTimer = true;
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = localStorage.getItem("_centerid");
    this._centername = localStorage.getItem("_centername");
    this._emailid = localStorage.getItem("_emailid");
    this.language = localStorage.getItem("_language");
    this.info = this.translateService.get("BASELINE.info")["value"];
    this.baseline_msg = this.translateService.get("BASELINE.baseline_msg")[
      "value"
    ];
    this.endline_msg = this.translateService.get("BASELINE.endline_msg")[
      "value"
    ];
    this.no_contents_found = this.translateService.get("PPT.no_contents_found")[
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

    this.route.queryParams.subscribe((params) => {
      this.type = params.parameters;
      if (this.type == "baseline") {
        this.getBaselineInfo(this.type, this.language, this._userid);
        this.page_title = this.translateService.get("APP.teacherbaseline")[
          "value"
        ];
      } else if (this.type == "endline") {
        this.getEndlineInfo(this.type, this.language, this._userid);
        this.page_title =
          this.translateService.get("APP.teacherendline")["value"];
      } else {
        console.log(
          "--> Type is wrong - " +
            this.type +
            ". Should be either baseline or endline"
        );
      }
      //this.getallbaselinequestion(params.parameters,this.language)
    });

    //--->>>Commented due to device back btn issue<<<---
    // this.platform.backButton.subscribeWithPriority(-1, () => {
    //   this.checkQuizStatus();
    // });
  }
  ngOnInit() {
    //this.slides.lockSwipes(true);
  }

  checkQuizStatus() {
    if (this.progressSaved == false) {
      this.confirmBox(this.confirmBox_header, "", this.confirmBox_msg);
    } else {
      this.calltoroot();
    }
  }

  //get individual teacher's baseline info
  async getBaselineInfo(type, language, userid) {
    await this.api.getbaselinedetails(type, language, userid).subscribe(
      (res) => {
        if (res.length > 0) {
          this.quizstatus = true;
          this.getbaselinemarksbyuser(type, userid);
          this.displaytext = this.baseline_msg;
        } else {
          this.getallbaselinequestion(type, this.language);
        }
      },
      (err) => {
        this.serverDownMsg.presentToast();
      }
    );
  }

  //get individual teacher's endline info
  async getEndlineInfo(type, language, userid) {
    await this.api.getbaselinedetails(type, language, userid).subscribe(
      (res) => {
        if (res.length > 0) {
          this.quizstatus = true;
          this.getbaselinemarksbyuser(type, userid);
          this.displaytext = this.endline_msg;
        } else {
          this.getallbaselinequestion(type, this.language);
        }
      },
      (err) => {
        this.serverDownMsg.presentToast();
      }
    );
  }

  //get all baseline question
  async getallbaselinequestion(type, language) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getallbaselinequestion(type, language).subscribe(
      (res) => {
        if (res.length > 0) {
          this.quizstatus = false;
          this.baseline_complete = false;
          this.quiz = res;
          console.log("array-->", this.quiz);
          // this.save_operation = 'update';
        } else {
          this.quizstatus = true;
          loading.dismiss();
          this.displaytext = this.no_contents_found;
          // this.save_operation = 'save';
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  //get All baselin marks
  async getbaselinemarksbyuser(type, userid) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getbaselinemarksbyuser(type, userid).subscribe(
      (res) => {
        if ((res.status = "success")) {
          this.baseline_marks = res;
          console.log(this.baseline_marks);
          this.message_div = true;
          this.odiaMark = this.baseline_marks.data[0].odia_score;
          this.mathMark = this.baseline_marks.data[0].math_score;
          this.engMark = this.baseline_marks.data[0].eng_score;
          this.technologyMark = this.baseline_marks.data[0].technology_score;
          this.pedagogyMark = this.baseline_marks.data[0].pedagogyscore;
          this.odiaTotalQuestion = this.baseline_marks.data[0].totalodiaques;
          this.mathTotalQuestion = this.baseline_marks.data[0].totalmathques;
          this.engTotalQuestion = this.baseline_marks.data[0].totalengques;
          this.technologyTotalQuestion =
            this.baseline_marks.data[0].totaltechques;
          this.pedagogyTotalQuestion =
            this.baseline_marks.data[0].totalpedagogyques;
          loading.dismiss();
        } else {
          console.log(this.baseline_marks);
          loading.dismiss();
          this.message_div = false;
        }
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  //checking endline status
  async checkregddate(userid) {
    await this.api.getuserregdate(userid).subscribe(
      (res) => {
        if (res.endlinestatus == true) {
          this.getallbaselinequestion(this.type, this.language);
          //this.getBaselineInfo(this.type,this.language,userid)
        } else {
          this.displaytext = "End line will activate from " + res.endlinedate;
        }
      },
      (err) => {
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
        this.submitButtonText = "Complete Quiz";
        this.showTimer = false;
        var startMinutes = this.startTime.getMinutes();
        var startSeconds = this.startTime.getSeconds();
        var endMinutes = this.stopTime.getMinutes();
        var endSeconds = this.stopTime.getSeconds();
        this.diff(
          startMinutes + ":" + startSeconds,
          endMinutes + ":" + endSeconds
        );
      }
    });
  }

  logData(data) {
    let count = 0;

    if (data.selectedOption == data.answer) {
      this.disable_submit_button = false;
      this.disable_radio = true;
      this.disable_next_button = true;
      this.showAlert(
        "Correct option:",
        "",
        "<h1><center>" + data.answer + "</center></h1>"
      );
    } else {
      count++;
      this.showAlert(
        "Correct option:",
        "",
        "<h1><center>" + data.answer + "</center></h1>"
      );
      this.disable_radio = true;
      this.disable_next_button = false;
      this.disable_submit_button = false;
    }
    if (count === this.quiz.length) {
      this.disable_submit_button = true;
      this.submitButton = true;
      this.submitButtonText = "Complete Quiz";
      this.showTimer = false;
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
    console.log("-->finishQuiz() invoked");
    this.totalScore = 0;
    this.score = 0;
    this.quiz.forEach((element) => {
      if (element.selectedOption === element.answer) {
        this.totalScore += 1;
        if (element.category === "odia") {
          this.odia_category += 1;
        } else if (element.category === "english") {
          this.eng_category += 1;
        } else if (element.category === "technology") {
          this.technology_category += 1;
        } else if (element.category === "pedagogy") {
          this.pedagogy_category += 1;
        } else if (element.category === "math") {
          this.math_category += 1;
        }
      }
    });

    const data = {
      userid: this._userid,
      username: this._username,
      centerid: this._centerid,
      centername: this._centername,
      emailid: this._emailid,
      language: this.language,
      type: this.type,
      assesmentquestion: this.quiz,
      totalmark: this.quiz.length,
      securedmark: this.totalScore,
      odia_category: this.odia_category,
      eng_category: this.eng_category,
      math_category: this.math_category,
      pedagogy_category: this.pedagogy_category,
      technology_category: this.technology_category,
    };

    this.secured_mark = this.totalScore;
    this.total_mark = this.quiz.length;

    await this.api.saveteacherbaselinedata(data).subscribe(
      (res) => {
        console.log("Save quiz res: ", res);
        console.log(data);

        if (res.status == "success") {
          this.showConfirm(this.secured_mark, this.total_mark);
          this.submitButton = false;
          this.disable_radio = true;
          this.progressSaved = true;
        } else if (res.status == "already_submitted") {
          this.showAlert("Error", "", "Quiz already submitted");
        } else if (res.status == "error") {
          this.showAlert("Error", "", "Internal server error");
        }
      },
      (err) => {
        console.error(err);
        this.serverDownMsg.presentToast();
      }
    );
  }

  //showConfirm
  async showConfirm(secured_mark, total_mark) {
    const alert = await this.alertController.create({
      header: "Quiz completed successfully",
      subHeader: "",
      cssClass: "alertclass",
      message:
        "Secured Mark:" + secured_mark + "</br>" + "Total Mark:" + total_mark,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.navController.navigateRoot("home-results");
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
      cssClass: "alertclass",
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
    this.navController.navigateBack("/home-results");
  }
}
