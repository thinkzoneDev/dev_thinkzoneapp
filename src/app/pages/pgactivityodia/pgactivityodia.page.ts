import { Component } from '@angular/core';
import {ToastController, ModalController} from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GeneralInstructionsPgePage } from '../../general-instructions-pge/general-instructions-pge.page';
import { RestApiService } from './../../rest-api.service';

@Component({
  selector: 'app-pgactivityodia',
  templateUrl: './pgactivityodia.page.html',
  styleUrls: ['./pgactivityodia.page.scss']
})
export class PgactivityodiaPage {
  program = 'pge';
  month_list: any = [];
  selected_level: string = '1';
  selected_month = '';
  selected_week = '';
  selected_subject = 'odia';
  toolbarshadow = true;
  activity_loaded = false;
  _userid: string;

  preferedlanguage: string = localStorage.getItem("_language");
  skill1_4: string  = '';
  skill5_8: string  = '';
  skill9_12: string  = '';
  skill13_16: string  = '';
  skill17_20: string  = '';

  constructor(
    public toastCtrl: ToastController,
    private modelctrl:ModalController,
    private translateService: TranslateService,
    private router: Router,
    public api: RestApiService
  ) {
    this.selected_level = '1';
    this._userid = localStorage.getItem('_userid');
    this.skill1_4 = this.translateService.get('PGEACTIVITY.skill1_4')['value'];
    this.skill5_8 = this.translateService.get('PGEACTIVITY.skill5_8')['value'];
    this.skill9_12 = this.translateService.get('PGEACTIVITY.skill9_12')['value'];
    this.skill13_16 = this.translateService.get('PGEACTIVITY.skill13_16')['value'];
    this.skill17_20 = this.translateService.get('PGEACTIVITY.skill17_20')['value'];
    
    this.getWeekCompleteLevel();
    this.pageload();
    this.generalInstructions();
  }

  async getWeekCompleteLevel() {
    await this.api.gettchassessmentbylevel(this._userid, "en", 'pge', this.selected_level, 
    this.selected_month, this.selected_subject).subscribe(res => {

      var month_list = [
        { value: '1', text: this.skill1_4, disabled: false, subject: this.selected_subject, iscompleted: false },
        { value: '2', text: this.skill5_8, disabled: false, subject: this.selected_subject, iscompleted: false },
        { value: '3', text: this.skill9_12, disabled: false, subject: this.selected_subject, iscompleted: false },
        { value: '4', text: this.skill13_16, disabled: false, subject: this.selected_subject, iscompleted: false },
        { value: '5', text: this.skill17_20, disabled: false, subject: this.selected_subject, iscompleted: false },
      ];

      for(var i =0; i< month_list.length; i++){
        var month_data = res.find((r) => r.month == month_list[i].value);
        if(month_data)
          month_list[i].iscompleted = month_data.iscompleted;
        else 
         month_list[i].iscompleted = false;

      }

      this.month_list =  month_list;
      
    }, err => {
      console.log(err);
    });
  }

  pageload(){
    // this.month_list = [
    //   {value:'1', text: this.skill1_4  , disabled: false, subject: 'odia'}, 
    //   {value:'2', text: this.skill5_8  , disabled: false, subject: 'odia'},
    //   {value:'3', text: this.skill9_12 , disabled: false, subject: 'odia'},
    //   {value:'4', text: this.skill13_16, disabled: false, subject: 'odia'},
    //   {value:'5', text: this.skill17_20, disabled: false, subject: 'odia'}
    // ];
  }

  show_activity_details(monthAndWeek: string){
    const mnw = monthAndWeek.split('$');
    this.selected_month = mnw[0];
    this.selected_week = mnw[1];
    this.selected_level = mnw[2];
    const paramiters = {
      program: this.program,
      subject: this.selected_subject,
      month: this.selected_month,
      week: this.selected_week,
      activity: this.selected_level
    };
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify(paramiters)
      }
    };
    this.router.navigate(['ecactivity2'], navigationExtras);
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }


async generalInstructions()
{
  const modal = await this.modelctrl.create({
      component: GeneralInstructionsPgePage
      //cssClass: "my-modal",
      });
      await modal.present();
      modal.onDidDismiss().then(data => {
    
      })
}

}
