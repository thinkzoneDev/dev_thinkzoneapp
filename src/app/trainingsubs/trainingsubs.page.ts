import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { RestApiService } from '../rest-api.service';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { Training2Page } from '../pages/training2/training2.page';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trainingsubs',
  templateUrl: './trainingsubs.page.html',
  styleUrls: ['./trainingsubs.page.scss'],
})
export class TrainingsubsPage implements OnInit {
    list: any;

    userid: string= "";
    submodules_list: any = [];
    isTrainingSession_alreadySaved: boolean = false;
    constructor(
      public api: RestApiService,
      public dataServ: DataService, 
      public navCtrl: NavController, 
      public loadingController: LoadingController,
      public modalController: ModalController
    ) {
      this.list = dataServ.getData('submodules');


      this.userid = localStorage.getItem('_userid');
      this.submodules_list = this.list;
      this.list = (this.list == undefined || this.list == null) ? [] : this.list;
      this.submodules_list = (this.submodules_list == undefined || this.submodules_list == null) ? [] : this.submodules_list;
      this.getTchTraaining_status();
    }

  ngOnInit() {}

  
  // for checking the specific activity is already saved by this user or not
  async getTchTraaining_status() {
    const loading = await this.loadingController.create({});
    await loading.present();

    await this.api.getsubmodulecompletionstatus(this.userid, this.list).subscribe(res => {
      this.list = res;
      loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  async submodule_click(submodule) {

    this.dataServ.setData('submodule', submodule);
    this.navCtrl.navigateForward('training2');

      // call eng assessment modal
      // const modal = await this.modalController.create({
      //   component: Training2Page,
      //   componentProps: { res: {submodule: submodule} }
      // });
      // modal.onDidDismiss()
      //   .then((data) => {
      //     // this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
      // });
      // return await modal.present();
  }
}
