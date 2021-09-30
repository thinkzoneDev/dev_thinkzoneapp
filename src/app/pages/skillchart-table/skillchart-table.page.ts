import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { RestApiService } from 'src/app/rest-api.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-skillchart-table',
  templateUrl: './skillchart-table.page.html',
  styleUrls: ['./skillchart-table.page.scss'],
})
export class SkillchartTablePage implements OnInit {
  tabledata: any = [];
  program:any;
  level:any;
  month:any;
  subject:any;

constructor(public dataServ: DataService, public modalCtrl: ModalController, public api: RestApiService,
  private loadingController: LoadingController, public alertController: AlertController,  private screenOrientation: ScreenOrientation) {
  this.tabledata = dataServ.getData('tabledata');
  this.program=localStorage.getItem('program');
  this.level=localStorage.getItem('level');
  this.month=localStorage.getItem('month');
  this.subject=localStorage.getItem('subject');
}
  // close modal
  closeModal() {
    this.modalCtrl.dismiss({data: 'Cancel'});
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }
 
  ngOnInit() {
  }

}
