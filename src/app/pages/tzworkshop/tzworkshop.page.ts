import { Component, OnInit } from "@angular/core";
import { ToastController, ModalController } from "@ionic/angular";
import { GeneralInstructionsPgePage } from "../../general-instructions-pge/general-instructions-pge.page";

@Component({
  selector: "app-tzworkshop",
  templateUrl: "./tzworkshop.page.html",
  styleUrls: ["./tzworkshop.page.scss"],
})
export class TzworkshopPage implements OnInit {
  preferedlanguage: string = localStorage.getItem("_language");
  userid: string = localStorage.getItem("_userid");
  program: string = "pge";
  subject: string = "math";
  level: string = "1";
  month: string = "";

  constructor(
    public modalController: ModalController,
    public toastCtrl: ToastController,

    private modelctrl: ModalController
  ) {
    this.generalInstructions();
    this.setdefault();
  }
  ngOnInit() {}
  async generalInstructions() {
    const modal = await this.modelctrl.create({
      component: GeneralInstructionsPgePage,
    });
    await modal.present();
    modal.onDidDismiss().then((data) => {});
  }

  setdefault() {
    this.preferedlanguage =
      localStorage.getItem("_language") == undefined ||
      localStorage.getItem("_language") == null ||
      localStorage.getItem("_language") == ""
        ? "en"
        : localStorage.getItem("_language");
    this.userid =
      localStorage.getItem("_userid") == undefined ||
      localStorage.getItem("_userid") == null ||
      localStorage.getItem("_userid") == ""
        ? ""
        : localStorage.getItem("_userid");
    this.program =
      this.program == undefined || this.program == null || this.program == ""
        ? "pge"
        : this.program;
    this.subject =
      this.subject == undefined || this.subject == null || this.subject == ""
        ? "math"
        : this.subject;
    this.level =
      this.level == undefined || this.level == null || this.level == ""
        ? "1"
        : this.level;
    this.month =
      this.month == undefined || this.month == null || this.month == ""
        ? ""
        : this.month;
  }
}

// TZ workshops Code

// import { Component, OnInit } from '@angular/core';
// import {
//   NavController,
//   AlertController,
//   LoadingController,
//   ModalController,
//   NavParams
// } from '@ionic/angular';
// import { RestApiService } from 'src/app/rest-api.service';

// @Component({
//   selector: 'app-tzworkshop',
//   templateUrl: './tzworkshop.page.html',
//   styleUrls: ['./tzworkshop.page.scss'],
// })
// export class TzworkshopPage implements OnInit {
//   wtype: string= 'leap';
//   userid: string= '';
//   username: string= '';
//   str_confirmation: string= "";

//   sr_obj: any;
//   leap_obj: any;
//   is_registered_leap: boolean = false;
//   is_registered_sr: boolean = false;

//   constructor(
//     public alertController: AlertController,
//     public modalController: ModalController,
//     public navController: NavController,
//     public loadingController: LoadingController,
//     public api: RestApiService
//   ) {
//     this.userid = localStorage.getItem('_userid');
//     this.username = localStorage.getItem('_username');
//     this.check_newuser(this.userid);
//   }
//   ngOnInit() {}

//   async check_newuser(userid){
//     const loading = await this.loadingController.create({});
//     await loading.present();
//     this.api.getworkshopregistrationdetails(userid,'sr').subscribe(res_sr => {
//       this.sr_obj = res_sr;
//       this.is_registered_sr = (res_sr.length > 0) ? true : false;

//       this.api.getworkshopregistrationdetails(userid,'leap').subscribe(res_leap => {
//         this.leap_obj = res_leap;
//         this.is_registered_leap = (res_leap.length > 0) ? true : false;
//         loading.dismiss();
//       }, err => {console.log(err);loading.dismiss();});

//     }, err => {console.log(err);});
//   }

//   sr_button_click() {
//     this.wtype = 'sr';
//     localStorage.setItem("_wtype", "school_readiness");
//     if(this.is_registered_sr){
//       this.naviagatesr();
//     }else{
//       this.str_confirmation = "It seems you are a new user for School Readiness program of ThinkZone Workshop.<br><br><b>Press OK to continue.</b>";
//       this.showConfirm('Confirmation','', this.str_confirmation, this.userid, this.username, this.wtype);
//     }
//   }

//   leap_button_click() {
//     this.wtype = 'leap';
//     localStorage.setItem("_wtype", "leap");
//     if(this.is_registered_leap){
//       this.naviagateleap();
//     }else{
//       this.str_confirmation = "It seems you are a new user for LEAP program of ThinkZone Workshop.<br><br><b>Press OK to continue.</b>";
//       this.showConfirm('Confirmation','', this.str_confirmation, this.userid, this.username, this.wtype);
//     }
//   }

//   naviagateback() {
//     this.navController.navigateBack('/home-results');
//   }

//   naviagatesr() {
//     this.navController.navigateBack('/tzworkschool');
//   }

//   naviagateleap() {
//     this.navController.navigateBack('/tzworkleap');
//   }

//   // confirm box
//   async showConfirm(header: string, subHeader: string, message: string, userid, username, wtype: string) {
//     const alert = await this.alertController.create({
//       header: header,
//       subHeader: subHeader,
//       message: message,
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel',
//           cssClass: 'secondary',
//           handler: data => {
//           }
//         }, {
//           text: 'Ok',
//           handler: data => {
//             this.set_registration_status(userid, username, wtype);
//           }
//         }
//       ]
//     });
//     await alert.present();
//   }

//   async set_registration_status(userid, username, wtype){
//     let body= {
//       userid: userid,
//       username: username,
//       wtype: wtype,
//       registrationdate: new Date(),
//       dayscompleted: 0,
//       wstatus: new Date()
//     };
//     const loading = await this.loadingController.create({});
//     await loading.present();
//     this.api.createworkshopregistration(body).subscribe(res => {
//       loading.dismiss();
//       if(wtype == 'sr'){
//         this.naviagatesr();
//       }else if(wtype == 'leap'){
//         this.naviagateleap();
//       }
//     }, err => {console.log(err);loading.dismiss();});
//   }

//   async get_registration_status(userid, wtype){
//     const loading = await this.loadingController.create({});
//     await loading.present();
//     this.api.getworkshopregistrationdetails(userid,wtype).subscribe(res => {
//       loading.dismiss();
//     }, err => {
//       console.log(err);
//       loading.dismiss();
//     });
//   }

//   // alert box
//   async showAlert(header: string, subHeader: string, message: string) {
//     const alert = await this.alertController.create({
//       header: header,
//       subHeader: subHeader,
//       message: message,
//       buttons: ['OK']
//     });
//     await alert.present();
//   }
// }
