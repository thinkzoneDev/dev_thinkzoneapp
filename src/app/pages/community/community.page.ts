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
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
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
    await this.api.getallcommunityvisit()
      .subscribe(res => {
        loading.dismiss();
        this.respons = res;
        //this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');         
      }, err => {
        loading.dismiss();
      });
  }

  async save(){
    if(this.main_arr.length <= 0 || this.main_arr.length < this.respons.length){
        this.showAlert('Community visit', '', 'Please enter all Community visit !!!');
    }else{
      let body = {
        userid : localStorage.getItem("_userid"),
        username : localStorage.getItem("_username"),
        centerid : localStorage.getItem("_centerid"),
        centername : localStorage.getItem("_centername"),
        community : this.main_arr
      }
      let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.createcommunitymgr(body)
        .subscribe(res => {
          loading.dismiss();
          this.showAlert('Community Visit', 'Community Visit', 'Community Visit '+res['status']+' !!!');
        }, err => {
          loading.dismiss();
        });
        this.navCtrl.navigateRoot('/center');
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
            "community_q": data.community,
            "community_a": answer_arr
        }
        this.insertIntoArray(data._id, newfeed);
    }

    selectOnChange_multiple(data: any, answer: any){
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "community_q": data.community,
            "community_a": answer
        }
        this.insertIntoArray(data._id, newfeed);
    }

    dateOnChange(data: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "community_q": data.community,
            "community_a": answer_arr
        }
        this.insertIntoArray(data._id, newfeed);
    }

    inputOnchange(data: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "community_q": data.community,
            "community_a": answer_arr
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

