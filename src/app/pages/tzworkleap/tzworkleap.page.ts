import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams
} from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-tzworkleap',
  templateUrl: './tzworkleap.page.html',
  styleUrls: ['./tzworkleap.page.scss'],
})
export class TzworkleapPage implements OnInit {
  wtype: string= 'leap';
  userid: string= '';
  username: string= '';

  startdate: any;
  startdate_str: string= '';
  enddate: any;
  enddate_str: string= '';
  days_completed: number= 0;
  days_remaining: number= 0;
  session_to_visit: number= 0;

  subjects: any = [];
  selected_subject: string= '';

  constructor(public modalController: ModalController,
    public navController: NavController,
    public loadingController: LoadingController,
    public api: RestApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.userid = localStorage.getItem('_userid');
    this.username = localStorage.getItem('_username');
    this.get_registration_status(this.userid, this.wtype);

    this.subjects = [
      {
        subject: 'Odia', 
        selected: false
      },
      {
        subject: 'English', 
        selected: false
      },
      {
        subject: 'Math', 
        selected: false
      }
    ];
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

  // close modal
  navigateback() {
    this.navController.navigateBack('/tzworkshop');
  }

  subject_button_click(subject) {
    this.selected_subject = subject.subject;
    let arr= [];
    this.subjects.forEach(obj => {
      if(obj.subject == subject.subject){
        obj.selected = true;
      }else{
        obj.selected = false;
      }
      arr.push(obj);
    });
    this.subjects = arr;
  }

  go_button_click(){
    if(this.selected_subject == undefined || this.selected_subject == null || this.selected_subject == ''){
      alert('Select a subject');
    }else{
      localStorage.setItem('_ws_userid',this.userid);
      localStorage.setItem('_ws_wtype',this.wtype);
      localStorage.setItem('_ws_subject',this.selected_subject);
      localStorage.setItem('_ws_day',''+this.session_to_visit);
      
      this.navController.navigateForward('/tabs');
    }
  }
}
