import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams } from '@ionic/angular';
  import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-tzworkschool',
  templateUrl: './tzworkschool.page.html',
  styleUrls: ['./tzworkschool.page.scss'],
})
export class TzworkschoolPage implements OnInit {
  wtype: string= 'sr';
  userid: string= '';
  username: string= '';

  startdate: any;
  startdate_str: string= '';
  enddate: any;
  enddate_str: string= '';
  days_completed: number= 0;
  days_remaining: number= 0;
  session_to_visit: number= 0;

  constructor( 
    public modalController: ModalController,
    public navController: NavController,
    public loadingController: LoadingController,
    public api: RestApiService
  ){ 
    this.userid = localStorage.getItem('_userid');
    this.username = localStorage.getItem('_username');
    this.get_registration_status(this.userid, this.wtype);
  }

  ngOnInit() {}

  async get_registration_status(userid, wtype){
    const loading = await this.loadingController.create({});
    await loading.present();
    this.api.getworkshopregistrationdetails(userid,wtype).subscribe(res => {
      if(res.length > 0){
        // START DATE CALCULATION
        this.startdate = res[0].registrationdate;
        let dts = new Date(this.startdate);
        this.startdate_str = dts.getDate()+' - '+(dts.getMonth()+1)+' - '+dts.getFullYear();

        // DAYS COMPLETED & DAYS REMAINING
        this.days_completed = res[0].dayscompleted;
        this.days_remaining = 50 - this.days_completed;
        this.session_to_visit = 1 + this.days_completed;

        // END DATE CALCULATION
        let dte = new Date(this.startdate);
        dte.setDate(dte.getDate() + this.days_remaining);
        this.enddate = dte;
        this.enddate_str = dte.getDate()+' - '+(dte.getMonth()+1)+' - '+dte.getFullYear();
      }
      loading.dismiss();
    }, err => {
      loading.dismiss();
    });
  }

  go_button_click(){
    localStorage.setItem('_ws_userid',this.userid);
    localStorage.setItem('_ws_wtype',this.wtype);
    localStorage.setItem('_ws_subject', 'na');
    localStorage.setItem('_ws_day',''+this.session_to_visit);
    
    this.navController.navigateForward('/tabs');
  }

  // close modal
  navigateback() {
    this.navController.navigateBack('/tzworkshop');
  }
}
