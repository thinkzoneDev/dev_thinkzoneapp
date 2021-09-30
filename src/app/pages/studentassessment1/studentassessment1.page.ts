import { Component, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';

import { RestApiService } from './../../rest-api.service';
import { Studentassessment2Page } from './../studentassessment2/studentassessment2.page';

@Component({
  selector: 'app-studentassessment1',
  templateUrl: './studentassessment1.page.html',
  styleUrls: ['./studentassessment1.page.scss']
})
export class Studentassessment1Page {
  public _id: any= "";
  public userid: string= "";
  public studentid: string= "";
  public studentname: string = "";
  public program: string= "";

  public assessment_list: any= [];

  public toolbarshadow: boolean = true;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    // gettchassessmenttest_student/:userid/:studentid/:program
    let studentObj= this.router.getCurrentNavigation().extras.state.studentObj;
    this._id = studentObj._id;
    this.userid = studentObj.userid;
    this.studentid = studentObj.studentid;
    this.studentname = studentObj.studentname;
    this.program = studentObj.program;

    this.getassessmentdetails();
  }

  async getassessmentdetails() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.gettchassessmenttest_student(this.userid, this.studentid, this.program)
      .subscribe(res => {
        this.assessment_list = res;
        loading.dismiss();
      }, err => {
        this.assessment_list = [];
        loading.dismiss();
      });
  }

  async open_assessment_details(studentObj) {
    const modal = await this.modalController.create({
      component: Studentassessment2Page,
      componentProps: { res: {studentObj: studentObj} }
    });
    modal.onDidDismiss()
      .then((data) => {
    });
    return await modal.present();
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
}
