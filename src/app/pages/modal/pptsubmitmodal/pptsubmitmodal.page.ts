import { Component, NgZone } from "@angular/core";
import {
  NavController,
  AlertController,
  LoadingController,
  ModalController,
  NavParams,
} from "@ionic/angular";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { RestApiService } from "./../../../rest-api.service";

@Component({
  selector: "app-pptsubmitmodal",
  templateUrl: "./pptsubmitmodal.page.html",
  styleUrls: ["./pptsubmitmodal.page.scss"],
})
export class PptsubmitmodalPage {
  res: any;
  data: any;
  is_content_saved: boolean = false;
  is_quiz_saved: boolean = false;
  disable_save_button: boolean = true;
  disable_quiz_button: boolean = true;
  success_message: string = "";
  constructor(
    public navController: NavController,
    public alertController: AlertController,
    public modalController: ModalController,
    private translateService: TranslateService,
    public api: RestApiService,
    private loadingController: LoadingController,
    public navParams: NavParams
  ) {
    this.success_message = this.translateService.get("PPT.success_message")[
      "value"
    ];

    // modal paramiters
    this.is_content_saved = this.navParams.data.res.content_status;
    this.is_quiz_saved = this.navParams.data.res.quiz_status;
    this.data = this.navParams.data.res.data;
    this.getTchTraaining_status(
      this.data.userid,
      this.data.moduleid,
      this.data.submoduleid,
      this.data.topicid
    );
    // if(this.is_content_saved == undefined || this.is_content_saved == null || this.is_content_saved == false){
    //   this.disable_save_button = false;
    //   this.disable_quiz_button = true;
    // }else if((this.is_quiz_saved == undefined || this.is_quiz_saved == null || this.is_quiz_saved == false) && this.is_content_saved == true){
    //   this.disable_save_button = true;
    //   this.disable_quiz_button = false;
    // }else if(this.is_content_saved == true && this.is_quiz_saved == true ){
    //   this.disable_save_button = true;
    //   this.disable_quiz_button = true;
    // }else
    // {
    //   this.disable_save_button = true;
    //   this.disable_quiz_button = true;
    // }
  }

  async save_button_click() {
    this.save(this.data);
  }

  async getTchTraaining_status(uid, mid, sid, tid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getppttopicdetails(uid, mid, sid, tid).subscribe(
      (res) => {
        console.log("--> res: ", res);

        if (res.length > 0) {
          if (res[0].content_status == true) {
            this.disable_save_button = true;
            this.disable_quiz_button = false;
          }
          if (res[0].quiz_status == true) {
            this.disable_quiz_button = true;
          }
        } else {
          this.disable_save_button = false;
          this.disable_quiz_button = true;
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
      }
    );
  }

  async quiz_button_click() {
    this.modalController.dismiss();
    if (this.navParams.data) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          parameters: this.navParams.data.res.data,
        },
      };
      this.navController.navigateForward("/pptquiz", navigationExtras);
    }
  }

  async preview_button_click() {
    this.modalController.dismiss();
    if (this.navParams.data) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          parameters: this.navParams.data.res.data,
        },
      };
      this.navController.navigateForward("/preview", navigationExtras);
    }
  }

  async save(data) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.saveppttchtraining(data).subscribe(
      (res) => {
        if (res.status == "success") {
          this.showAlert("", "", this.success_message);
          this.disable_save_button = true;
          this.disable_quiz_button = false;
        }
        loading.dismiss();
        //this.modalController.dismiss({data: 'Ok'});
        //this.navController.navigateRoot('/ppttrainingcontent');
      },
      (err) => {
        loading.dismiss();
      }
    );
  }

  // alert box
  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ["OK"],
    });

    await alert.present();
  }

  // confirm box
  async showConfirm(
    header: string,
    subHeader: string,
    message: string,
    body: any
  ) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Ok",
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  // close modal
  closeModal() {
    this.modalController.dismiss({ data: "Cancel" });
  }
}
