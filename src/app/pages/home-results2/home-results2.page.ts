import { Component, ViewChild,  NgZone } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController, 
  RouterLinkDelegate} from '@ionic/angular';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { RestApiService } from './../../rest-api.service';
import { TranslateConfigService } from './../../translate-config.service';
import { Router, NavigationEnd } from '@angular/router';
import {IonSlides} from '@ionic/angular';


@Component({
  selector: 'app-home-results2',
  templateUrl: './home-results2.page.html',
  styleUrls: ['./home-results2.page.scss']
})
export class HomeResults2Page {

  slideOpts :any;
  _username: string = localStorage.getItem('_username').toUpperCase();
  searchKey = '';
  yourLocation = '123 Test Street';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';
  userid :String = localStorage.getItem('_userid')
  action:any;
  value : any;
  eceactivity : String;
  isliked:Boolean = false;
  isliked2:boolean = false;
  isliked3:boolean = false;
  isliked4:boolean = false;
  current_date: string;
  centers: any;
  date: number;
  month: string;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  toolbarshadow = true;

  dlprogress: string = '';
  txt_url: string = '';
  txt_ext: string = '';
  @ViewChild('slider',) slider: IonSlides;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingController: LoadingController,
    public api: RestApiService,
    private router:Router,
    private _ngZone: NgZone
  ) {
    this.slideOpts = {
      initialSlide: 0,
      runCallbacksOnInit: false,
      centeredSlides:true,
      loop:true,
      pager:true,
      slidesPerView:1,
      autoplay:true,
      spaceBetween: 10,
    };
 
    this.centers = [];
    this.api.getcurrentdate().subscribe(res => {
        if (res != undefined && res != null && Object.keys(res).length > 0 ) {
          this.current_date = res['current'];
        } else {
          this.current_date = '';
        }
      }, err => {
      }
    );

    this.api.getallcentersallocatedbyuserid(localStorage.getItem('_userid')).subscribe(res => {
        if (res != undefined && res != null && Object.keys(res).length > 0 ) {
          this.centers = res[0]['centers'];
        
        } else {
          this.centers = [];
        }
      }, err => {
      }
    );

    const dt = new Date();
    this.date = dt.getDate();
    this.month = this.months[dt.getMonth()];
    this.setCheckinTime();
  }
  
  
// ionViewDidEnter() {
//    // this.slides.autoplayDisableOnInteraction = false;
//   }
ngOnInit() {
 this.getfeedback()
}
  async setCheckinTime(){
    let obj = {
      userid : localStorage.getItem('_userid'),
      username : localStorage.getItem('_username'),
      checkintime : new Date()
    };
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.setcheckintime(obj).subscribe(res => {
        if(res.document_id != undefined && res.document_id != null){
          localStorage.setItem('_document_id',res.document_id);
        }
        loading.dismiss();
      }, err => {
        loading.dismiss();
      });
  }

  centerButtonClicked(center: any) {
    if (Object.keys(center).length > 0) {
      localStorage.setItem('_operationdate', this.current_date);
      localStorage.setItem('_centerid', center.centerid);
      localStorage.setItem('_centername', center.centername);
      this.navController.navigateForward('/center');
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.slider.startAutoplay();
  }

  settings() {
    this.navController.navigateForward('settings');
  }

  async alertLocation() {
    const changeLocation = await this.alertCtrl.create({
      header: 'Change Location',
      message: 'Type your Address.',
      inputs: [
        {
          name: 'location',
          placeholder: 'Enter your new Location',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Change',
          handler: async (data) => {
            this.yourLocation = data.location;
            const toast = await this.toastCtrl.create({
              message: 'Location was change successfully',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });

            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage
    });
    return await modal.present();
  }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  async notifications(ev: any) {
    /*const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
    */
    this.navController.navigateForward('/message');
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
   
slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }


ionViewDidEnter(){
    this.slider.update();
  //  this.slider.autoplayDisableOnInteraction = false;
}

ionViewWillLeave(){
    this.slider.stopAutoplay();
}

// isLiked:boolean=true;
// onLike(value)
// {
//   value++;
// }

   


async getfeedback(){
  const body = {
    userid : this.userid,
  }
   this.api.gettchfeedback(body).subscribe(res => {

   this.value = res;
   this.isliked = this.value.is_like;
// this.feedback = this.value.feedback; 

    }, err => {
    
    }); 
}


isLiked(activity_name){
  var act_res = (this.value || []).find((a) => a.activity_name == activity_name)
  if(act_res)
    return act_res.is_like || false;

}

async feedback_update(action, activity_name) {
  {
    // if(action == 'like'){
    //   this.isliked1 = true;
      
    // }else if(action == 'unlike'){
    //   this.isliked1 = false;
    // }

    this.isliked = action === 'like';
    

    const body = {
      userid : this.userid,
      is_like :this.isliked,
      activity_name : activity_name,
      feedback : ''  ,
    };
    // const loading = await this.loadingController.create({});
    // await loading.present();
    await this.api.savetchfeedback(body).subscribe(res => {
 
      // loading.dismiss();
      // this.location.back();

      this._ngZone.run(() => { 
      
      var act_res_index = (this.value || []).findIndex((a) => a.activity_name == activity_name)
      if(act_res_index >= 0 )
        this.value[act_res_index].is_like = this.isliked;


      });
     

      }, err => {
        // loading.dismiss();


        // this.value
        //1 - call api 
        //2 update this.value variable 


        var act_res_index = (this.value || []).findIndex((a) => a.activity_name == activity_name)
        if(act_res_index >= 0 )
          this.value[act_res_index].is_like = this.isliked;

      });
      //this.nav
  }
}

feedback1_update(action){

}



feedback2_update(action){
  
}


feedback3_update(action){
  
}


}
