import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from 'src/app/rest-api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  ws_userid: string= '';
  preferred_language: string;
  ws_wtype: string= '';
  ws_subject: string= '';
  ws_action: string= 'gi';
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


  // GET CONTENT STATUS OF THIS DAY
  // IF NO RECORDS -> CREATE AN RECORD -> GET THE RECORD ID -> UPDATE STATUS IN SUBSEQUENT STEPS
  // IF RECORDS FOUND -> GET THE RECORD ID -> UPDATE STATUS IN SUBSEQUENT STEPS
  /*
    router.get('/getwscontent_status/:language/:userid/:wtype/:action/:subject/:level/:day', tzworkshop_content_status.getwscontent_status);
    router.post('/createwscontent_status', tzworkshop_content_status.createwscontent_status);
    router.put('/updatewscontent_status/:id', tzworkshop_content_status.updatewscontent_status);
  */
  get_recordid_of_the_day(){

  }

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
