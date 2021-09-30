import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';

  import { RestApiService } from './../../rest-api.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.page.html',
  styleUrls: ['./assessment.page.scss'],
})
export class AssessmentPage implements OnInit {
  respons: any;
  main_arr: any = [];

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getResponse();
  }

  async getResponse() {
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallassessment()
      .subscribe(res => {
        loading.dismiss();
        this.respons = res;
        //this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']);         
      }, err => {
        loading.dismiss();
      });
  }

  async save(){
    if(this.main_arr.length <= 0 || this.main_arr.length < this.respons.length){
        this.showAlert('Assessment Info', '', 'Please enter all assessment info');
    }else{
      let body = {
        userid : localStorage.getItem("_userid"),
        username : localStorage.getItem("_username"),
        centerid : localStorage.getItem("_centerid"),
        centername : localStorage.getItem("_centername"),
        assessmentinfo : this.main_arr
      }
      let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.createassessmentmgr(body)
        .subscribe(res => {
          res = (res == undefined || res == null) ? [] : res;
          loading.dismiss();
          if(res[status] == 'success'){
            this.showAlert('Assessment', 'Assessment', 'Assessment saved Successfully');
          }
          // this.showAlert('Assessment', 'Assessment', 'Assessment saved '+res['status']);
        }, err => {
          loading.dismiss();
        });
        this.navCtrl.navigateBack('/center');
    }
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

    // =====================================
    selectOnChange_single(data: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "assessment_q": data.assessment,
            "assessment_a": answer_arr
        }
        this.insertIntoArray(data._id, newfeed);
    }

    selectOnChange_multiple(data: any, answer: any){
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "assessment_q": data.assessment,
            "assessment_a": answer
        }
        this.insertIntoArray(data._id, newfeed);
    }

    dateOnChange(data: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "assessment_q": data.assessment,
            "assessment_a": answer_arr
        }
        this.insertIntoArray(data._id, newfeed);
    }

    inputOnchange(data: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "assessment_q": data.assessment,
            "assessment_a": answer_arr
        }
        this.insertIntoArray(data._id, newfeed);
    }

    insertIntoArray(_id, newfeed){
        let ele_found = false;
        let index = 0, i = 0;
        this.main_arr.forEach(ele => {
            if(ele['_id'] == _id){
                ele_found = true;
                index = i;
                return;
            }
            i++;
        });

        if(ele_found){
            this.main_arr.splice(index,1);
            this.main_arr.push(newfeed);
        }else{
            this.main_arr.push(newfeed);
        }
    }
    // =====================================
}
