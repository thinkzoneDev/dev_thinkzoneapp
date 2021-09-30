import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-tzscrollcontent',
  templateUrl: './tzscrollcontent.page.html',
  styleUrls: ['./tzscrollcontent.page.scss'],
})
export class TzscrollcontentPage implements OnInit {
  ws_userid: string= '';
  preferred_language: string;
  ws_wtype: string= '';
  ws_subject: string= '';
  ws_action: string= 'ip';
  ws_level: string= 'na';
  ws_worksheet: string= 'na';
  ws_day: string= '';
  levels_list: any = [];

  wtype: string;
  language: string;
  subject: string;
  level: string;
  content: string;

  constructor(
    public api: RestApiService,
    public navController: NavController,
    public loadingController: LoadingController,
  ) { 
    this.ws_userid = localStorage.getItem('_ws_userid');
    this.preferred_language = localStorage.getItem("_language");
    this.ws_wtype = localStorage.getItem('_ws_wtype');
    this.ws_subject = localStorage.getItem('_ws_subject');
    this.ws_level = localStorage.getItem('_ws_level');
    this.ws_day = localStorage.getItem('_ws_day');
    this.ws_subject = (this.ws_wtype == 'sr') ? 'na' : this.ws_subject;
    this.getDetails();
  }

  ngOnInit() {}

  async getDetails() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getwscontent(this.preferred_language, this.ws_wtype, this.ws_subject, this.ws_action, this.ws_level, this.ws_day).subscribe(res => {
      if(res != undefined && res != null && res.length > 0){
        this.content = res[0]['content'];
      }
      loading.dismiss();
    }, err => {
      loading.dismiss();
    })
  }

  complete_session_button_click(){
    this.navController.navigateRoot("/tzworkshop");
  }
}
