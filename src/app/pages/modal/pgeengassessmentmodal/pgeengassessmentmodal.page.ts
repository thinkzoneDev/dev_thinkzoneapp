import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams } from '@ionic/angular';

// Modals
import { RestApiService } from './../../../rest-api.service';
import { stagger } from '@angular/animations';


@Component({
  selector: 'app-pgeengassessmentmodal',
  templateUrl: './pgeengassessmentmodal.page.html',
  styleUrls: ['./pgeengassessmentmodal.page.scss']
})
export class PgeengassessmentmodalPage {
  assessment_list: any = [];
  assessmenttest: any = [];
  public makepaymentFormGroup: FormGroup;
  amount: string = '';
  remark: string = '';
  isAssessmentTaken: boolean = false;
  assessmentTestRecords: any = [];

  res: any;
  userid: string;
  username: string;
  centerid: string;
  centername: string;
  studentid: string;
  studentname: string;
  program: string = '';
  class: string = '';
  stage: string = '';

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
    public navParams: NavParams
  ) {
    this.makepaymentFormGroup = this.formBuilder.group({
      amount: ['', [Validators.required]],
      remark: ['', [Validators.required]]
    });
    
    // modal paramiters
    this.res = this.navParams.data.res;

    this.userid = this.res.userid;
    this.username = this.res.username;
    this.studentid = this.res.studentid;
    this.studentname = this.res.studentname;
    this.program = this.res.program;
    this.class = this.res.class;
    this.stage = this.res.stage;

    this.gettchassessmenttest();
  }

  // get tch assessment test records
  // get tch assessment
  async gettchassessmenttest() {
    const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.gettchassessmenttest(this.studentid, this.program, this.class, this.stage, "english")
        .subscribe(res => {
          console.log('1@@-> res: '+JSON.stringify(res))
          if(res.length > 0){
            this.isAssessmentTaken = true;
            this.assessmentTestRecords = res;
            alert('Assessment already taken !!!')
          }else{
            this.isAssessmentTaken = false;
            this.gettchassessment();
          }
          loading.dismiss();
        }, err => {
          loading.dismiss();
        });
  }


  // get tch assessment
  async gettchassessment() {
    let preflanguage = localStorage.getItem('_language');
    const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.gettchassessment(preflanguage, this.program, this.class, this.stage, "english")
        .subscribe(res => {
          console.log('2@@-> res: '+JSON.stringify(res))
          this.assessment_list = res;
          loading.dismiss();
        }, err => {
          loading.dismiss();
        });
  }

  // yes or no clicked
  segmentChanged(assessment, value){
    const assessment_id = assessment._id;
    const question_id = assessment.id;
    const question = assessment.question;
    const answer = value;
    this.add_to_attendancelist(assessment_id, question_id, question, answer);
  }

  // add to attendance list
  add_to_attendancelist(assessment_id, question_id, question, answer){
    const obj = {
      assessment_id : assessment_id,
      id : question_id,
      question : question,
      answer : answer
    };

    if(this.assessmenttest.length > 0){
      // check for record exist or not
      let i = 0, index = -1;
      this.assessmenttest.forEach(element => {
        if(element.assessment_id == assessment_id){
          index = i;
          return;
        }
        i++;
      });
      if(index >= 0){
        this.assessmenttest.splice(index,1,obj);
      }else{
        this.assessmenttest.push(obj);
      }
    }else{
      this.assessmenttest.push(obj);
    }
  }

  
  // save attendance
  async save_assessment(){
    const data = {
      userid : this.userid,
      username : this.username,
      studentid : this.studentid,
      studentname : this.studentname,
      program : this.program,
      class : this.class, 
      stage : this.stage, 
      subject: "english",
      assessmenttest : this.assessmenttest
    };

    if(this.assessment_list.length != this.assessmenttest.length){
      this.showAlert('Info','','Please complete the questionnaire')
    }else{
      this.save(data);
    }
  }

  async save(data) {
    const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.createtchassessmenttest(data)
        .subscribe(res => {
          if(res['status']){
            this.showAlert('Info','',' Questionnaire completed successfully');
          }
          // this.showAlert('Info','','Assessment saved '+res['status']+' !!!');
          loading.dismiss();
          this.modalController.dismiss({data: 'Ok'});
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

  // confirm box
  async showConfirm(header: string, subHeader: string, message: string, body: any) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }
  
  // close modal
  closeModal() {
    this.modalController.dismiss({data: 'Cancel'});
  }
}