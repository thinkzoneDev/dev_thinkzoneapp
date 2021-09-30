import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, LoadingController, NavController } from '@ionic/angular';
import { RestApiService } from './../../rest-api.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-teacherassesment',
  templateUrl: './teacherassesment.page.html',
  styleUrls: ['./teacherassesment.page.scss']
})
export class TeacherAssesmentPage {
  // quiz;
  qno = 1;
  submitButton;
  submitButtonText;
  score;
  totalScore;
  trainingobj: any = {};
  content = '';
  worksheet: any = [];
  video: any = [];
  image: any = [];
  quiz: any;
  minutes:any;
  seconds:any;
  // totalSeconds:number = 0;

  disable_radio: boolean= false;
  disable_next_button: boolean= true;
  user_quiz: any= [];
  secured_mark: number= 0;
  total_mark: number = 0;
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  startTime: Date;
  stopTime: Date;
  active: boolean = false
  showTimer:boolean = false;
  language:string;
  get display() { return (this.startTime && this.stopTime) ? +this.stopTime - +this.startTime : 0 }
  moduleid:any;
  topicid:any;
  quizstatus:Boolean = true;
  assesmentmonth:string = '';
  assesment:any = '';
  quizlength:any = '';
  @ViewChild('slides') slides;
  constructor(
    public navController: NavController,
    public modalCtrl: ModalController, 
    public api: RestApiService,
    private loadingController: LoadingController, 
    public alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.startTime = new Date()
    this.timer()
    this.showTimer = true;
    //  setInterval(this.startTimer, 1000);
    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._centerid = '';
    this._centername = '';
    this.language = localStorage.getItem('_language');
    this.route.queryParams.subscribe((params) => {
      if(params.parameters == undefined){
        this.quizstatus = true
      }else{
        this.quizstatus = false
        this.assesmentmonth = params.parameters;
        this.getallassesment(this.assesmentmonth,this.language)
        this.getassesmentbyuser(this._userid,this.assesmentmonth,this.language)
      }
      // if(params.parameters != '' && params.parameters != undefined){
      //   // this.quizstatus = true;
      //   this.assesmentmonth = params.parameters;
      // }else{
      //   // this.quizstatus = false;
      // }
      // this.getallassesment(this.assesmentmonth)
      // // this.alldata = params.parameters.program;
    });
  }
  isAssessmentTaken:boolean=false;
  async getassesmentbyuser(userid,assesmentmonth,language) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.gettchassessmenttest1(userid,assesmentmonth,language)
      .subscribe(res => {
        if(res.length > 0){
          this.isAssessmentTaken = true;
        }else{
          this.isAssessmentTaken = false;
          // this.quizstatus = true;
          
          // this.gettchassessment();
        }
        loading.dismiss();
      }, err => {
        loading.dismiss();
      });
     
  }
 
  async getallassesment(assesmentmonth,language) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.gettchassessmenttraining(assesmentmonth,language)
      .subscribe(res => {
        if(res.length > 0){
          this.quiz = res[0].quiz;
          this.quizstatus = false;
          this.quizlength = this.quiz.length;
          this.total_mark = this.quiz.length;
        }else{
          this.quizstatus = true;
          // this.isAssessmentTaken = false;
          // this.gettchassessment();
        }
        loading.dismiss();
      }, err => {
        loading.dismiss();
      });
  }
  timer() {
      this.stopTime = new Date()
      setTimeout(()=>{
        this.timer()
      }, 1000)
  }
  ngOnInit() {
    //  this.slides.lockSwipes(true);
  }
  
  slideChanged(event){
    this.slides.getActiveIndex().then(index => {
       this.qno = index+1;
    });
}


  move(n: number) {
    this.disable_radio = false;
    this.disable_next_button = true;

    if (this.slides == null) {
      alert('null');
    } else {
      if (n > 0 && this.qno !== this.quiz.length) {
        // this.slides.lockSwipes(false);
        this.slides.slideNext();
        // this.slides.lockSwipes(true);
        this.qno++;
      } else if (n < 0 && this.qno !== 1) {
        // this.slides.lockSwipes(false);
        this.slides.slidePrev();
        // this.slides.lockSwipes(true);
        this.qno--;
      } else {
      }
    }
  }

  ngAfterViewInit() {
  }

  logData(data) {
    let count = 0;
    this.quiz.forEach(element => {
      if (element.selectedOption !== 0 && typeof(element.selectedOption) != 'undefined') {
        count++;
        if(data.selectedOption === element.answer){
          this.disable_radio = true;
          this.disable_next_button = false;
          this.calculate_total_mark(data.qid, data);
          this.showAlert('Correct option:', '', '<h1><center>'+data.answer+'</center></h1>');
          this.move(1);
        }else{
          this.showAlert('Correct option:', '', '<h1><center>'+data.answer+'</center></h1>');
          this.move(1);
          this.disable_radio = false;
          this.disable_next_button = true;
        }
      }
    });
    if (count === this.quiz.length) {
      this.submitButton = true;
      this.submitButtonText = 'Complete Quiz';
      this.showTimer = false;
      var startMinutes = this.startTime.getMinutes();
      var startSeconds = this.startTime.getSeconds();
      var endMinutes = this.stopTime.getMinutes();
      var endSeconds = this.stopTime.getSeconds();
      this.diff(startMinutes+':'+startSeconds,endMinutes+':'+endSeconds);
    }
  }
  timeTaken:any;
  diff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    var result = (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
    this.timeTaken = result;
}
  calculate_total_mark(quid, quizObj){
    if (!this.user_quiz.some((item) => item.qid == quid)) {
      this.secured_mark = (quizObj.answer === quizObj.selectedOption) ? this.secured_mark + 1 : this.secured_mark ;
      this.user_quiz.push(quizObj);
    }
  }

  async finishQuiz() {
    this.totalScore = 0;
    this.score = 0;
    this.quiz.forEach(element => {
      this.totalScore += 10;
      if (element.selectedOption === element.answer) {
        this.score += 10;
      }
    });
    // this.showAlert('Score Details', '', '<p>Secured Mark:'+this.secured_mark+'</p></br><p>Total Mark:'+this.total_mark+'</p></br><p>Time Duration:'+this.timeTaken+'</p>');
    this.showConfirm(this.secured_mark,this.total_mark,this.timeTaken);
    const data ={
        "userid":this._userid,
        "assesmentmonth":this.assesmentmonth,
        "assesmenttotalmark":this.total_mark,
        "assesmentscore":this.secured_mark,
        "assesmentlanguage": this.language
    }
    await this.api.createteachertestassesment(data).subscribe(res => {
        if(res.status ==  'success'){
          this.navController.navigateBack('training1');
          this.submitButton = false;
          this.disable_radio = true;
        }
      }, err => {
       
      });
  }
  async showConfirm(secured_mark,total_mark,timeTaken){
    const alert = await this.alertController.create({
      header: 'Score Details',
      subHeader: '',
      message: 'Secured Mark:'+secured_mark +'</br>'+'Total Mark:'+total_mark+'</br>'+'Time Duration:'+timeTaken,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.navController.navigateBack('training1');
          }
        }
      ]
    });
    await alert.present();
  }
  // alert box
  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
