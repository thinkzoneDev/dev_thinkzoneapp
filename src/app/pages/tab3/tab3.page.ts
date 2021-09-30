import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  ws_userid: string= '';
  preferred_language: string;
  ws_wtype: string= '';
  ws_subject: string= '';
  ws_action: string= 'ip';
  ws_level: string= 'na';
  ws_worksheet: string= 'na';
  ws_day: string= '';
  levels_list: any = [];
  selected_level: string= '';
  
  constructor(
    public navController: NavController,
    public loadingController: LoadingController,
    public api: RestApiService
  ) {
    this.ws_userid = localStorage.getItem('_ws_userid');
    this.preferred_language = localStorage.getItem("_language");
    this.ws_wtype = localStorage.getItem('_ws_wtype');
    this.ws_subject = localStorage.getItem('_ws_subject');
    this.ws_day = localStorage.getItem('_ws_day');
    this.ws_subject = (this.ws_wtype == 'sr') ? 'na' : this.ws_subject;

    this.getDetails();
  }

  ngOnInit() {}
  
  async getDetails() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getwslevel(this.preferred_language, this.ws_wtype, this.ws_subject, this.ws_day).subscribe(res => {
      if(res != undefined && res != null && res.length > 0){
        this.levels_list = res;
      }
      loading.dismiss();
    }, err => {
      loading.dismiss();
    })
  }

  level_onclick(level) {
    this.selected_level = level.level;
    localStorage.setItem('_ws_level', this.selected_level);
    this.navController.navigateForward("/tzscrollcontent");
  }
}
