import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/rest-api.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})

export class Tab2Page implements OnInit {
  ws_userid: string= '';
  preferred_language: string;
  ws_wtype: string= '';
  ws_subject: string= '';
  ws_action: string= 'gt';
  ws_level: string= 'na';
  ws_worksheet: string= 'na';
  ws_day: string= '';
  content: string;

  constructor(
    public api: RestApiService,
    private loadingController: LoadingController
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
    await this.api.getwscontent(this.preferred_language, this.ws_wtype, this.ws_subject, this.ws_action, this.ws_level, this.ws_day).subscribe(res => {
      if(res != undefined && res != null && res.length > 0){
        this.content = res[0]['content'];
      }
      loading.dismiss();
    }, err => {
      loading.dismiss();
    })
  }
}
