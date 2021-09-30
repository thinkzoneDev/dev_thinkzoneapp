import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, LoadingController, AlertController, NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { RestApiService } from './../../../rest-api.service';

@Component({
  selector: 'app-endline',
  templateUrl: './endline.page.html',
  styleUrls: ['./endline.page.scss'],
})
export class EndlinePage implements OnInit {
  res: any;
  _id = '';
  userid = '';
  username = '';
  centerid = '';
  centername = '';
  studentid = '';
  studentname = '';
  program = '';
  class = '';
  phone = '';
  gender = '';
  dob = '';
  parentsname = '';
  level = '';
  createdon = '';

  endline_q: any = [];
  endline_questionset: any = [];
  subject = '';
  lvl = '';

  _maindata: any = [];
  _questionset: any = [];
  score = 0;
  totalmark = 0;

  preferedlanguage: string = localStorage.getItem('_language');
  hide_info_div = true;
  hide_cont_div = false;

  answerList: any = {};

  @Input() value: any;
  constructor(
    private modalController: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public api: RestApiService,
    public navParams: NavParams
  ) {
    this.hide_info_div = true;
    this.hide_cont_div = true;
  }

  ngOnInit() {
    this.res = this.navParams.data.res;
    this._id = this.res._id;
    this.studentname = this.res.studentname;
    this.program = this.res.program;
    this.class = this.res.class;
    this.subject = this.navParams.data.subject;
    this.lvl = this.navParams.data.selected_level;

    this.subject = (this.subject == '' ||this.subject == null || this.subject == undefined) ? 'na' : this.subject ;
    this.getData();
  }

  closeModal() {
    this.modalController.dismiss({data: 'Cancel'});
    this.showAlert('Set Level', '', 'Student level not Set');
  }

  async getData() {
    const data = {
      preferedlanguage: this.preferedlanguage,
      program: this.program,
      level: this.lvl,
      subject: this.subject
    };
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getbaselinetestquestionset(data)
      .subscribe(res => {
        res = (res == undefined || res == null) ? [] : res;
        loading.dismiss();
        this.endline_q = res;

        if (this.endline_q.length <= 0) {
          this.hide_info_div = false;
          this.hide_cont_div = true;
          this.endline_questionset = [];
        } else {
          this.hide_info_div = true;
          this.hide_cont_div = false;
          this.endline_questionset = this.endline_q[0].questionset;
        }
        // this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');
      }, err => {
        loading.dismiss();
      });
  }

  select_answer_onchange(value, selected_question) {
    this.answerList[selected_question.id] = value;
    const qid = selected_question.id;
    const question = selected_question.question;
    const user_answer = value;

    const qset = {
      qid : qid,
      question : question,
      useranswer : user_answer
    };

    // if questionset array is empty
    if (this._questionset.length <= 0) {
      this._questionset.push(qset);
    } else {
      let i = 0;
      let existing_index = -1;

      // check that question is already exist or not
      this._questionset.forEach(element => {
        if (element.qid === qid) {
          existing_index = i;
          return;
        }
        i++;
      });
      // if that question is exist
      if (existing_index >= 0) {
        this._questionset.splice(existing_index, 1, qset);
      } else {
        this._questionset.push(qset);
      }
    }
  }

  calculate_totalscore() {
    let i = 0;
    this._questionset.forEach(element => {
      if (element.useranswer === element.answer) {
        this.score += 1;
      } else {
        // this.score -= 1;
      }
      i++;
    });
    this.totalmark = i;
  }

  async setLevel() {
    if (this._questionset.length <= 0) {
      // this.showAlert('Info', '', 'Please enter all endline tests.');
      this.showAlert('Info', '', ' Kindly fill the details');
    } else if (this.endline_questionset.length != this._questionset.length) {
      this.showAlert('Info', '', ' Kindly fill all the details');
    }else {
      this.calculate_totalscore();
      const data = {
        detailsid: this._id,
        subject: this.subject,
        level: this.lvl,
        endlinetest: this._questionset,
        endlinetestresult: this.score
      };
      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.setlevelbyid(data)
        .subscribe(res => {
          this.updateLevelInStudentDetail();
          loading.dismiss();
          if(res['status'] == 'success'){
            // this.showAlert('Set Level', '', 'Student level set Successfully');
            this.showAlert('Set Level', '', 'The student\'s level set successfully');
          }
          else{
            this.showAlert('Set Level', '', 'Student level set ' + res['status'] + ' !!!');
          }
          // this.showAlert('Set Level', '', 'Student level set ' + res['status'] + ' !!!');
          this.modalController.dismiss({data: 'Ok'});
        }, err => {
          loading.dismiss();
        });
    }
  }

  async updateLevelInStudentDetail() {
    const id = this._id;
    let data: any;
    if (this.subject === '' || this.subject === 'na') {
      data = { ec_level : this.lvl };
    } else if (this.subject === 'math') {
      data = { math_level : this.lvl };
    } else if (this.subject === 'english') {
      data = { eng_level : this.lvl };
    } else if (this.subject === 'odia') {
      data = { odia_level : this.lvl };
    }
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.updatelevelbyid(id, data)
      .subscribe(res => {
        loading.dismiss();
        // this.showAlert('Set Level', '', 'Student level set '+res['status']+' !!!');
      }, err => {
        loading.dismiss();
      });
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
