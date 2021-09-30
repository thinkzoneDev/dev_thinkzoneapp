import { Component, NgZone } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-studentassessment2',
  templateUrl: './studentassessment2.page.html',
  styleUrls: ['./studentassessment2.page.scss']
})
export class Studentassessment2Page {
  public res: any;

  public studentname: string= "";
  public program: string= "";
  public stage: string= "";
  public subject: string= "";
  public level: string= "";
  public assessment_set: any= [];

  public toolbarshadow: boolean = true;

  constructor( public navParams: NavParams, 
    public modalController: ModalController) {
    this.res = this.navParams.data.res;
    this.studentname= this.res.studentObj.studentname;
    this.program= this.res.studentObj.program;
    this.stage= this.res.studentObj.stage;
    this.subject= this.res.studentObj.subject;
    this.level= this.res.studentObj.level;
    this.assessment_set= this.res.studentObj.assessmenttest;
    this.assessment_set = (this.assessment_set == undefined || this.assessment_set == null) ? [] : this.assessment_set ;
  }

  // close modal
  closeModal(flag) {
    let dismissObj = {};
    if(flag === 'cancel') dismissObj = { data: 'cancel'}
    else dismissObj = { data: 'save'}
    this.modalController.dismiss(dismissObj);
  }
  
  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
}
