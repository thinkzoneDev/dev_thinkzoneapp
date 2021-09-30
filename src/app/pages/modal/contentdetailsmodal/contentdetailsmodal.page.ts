import { Component } from "@angular/core";
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
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";

@Component({
  selector: "app-contentdetailsmodal",
  templateUrl: "./contentdetailsmodal.page.html",
  styleUrls: ["./contentdetailsmodal.page.scss"],
})
export class ContentdetailsmodalPage {
  res: any;
  data: any;
  _userid: string;
  _username: string;
  contentdata: any;
  alldata: any;
  language: string;
  is_content_saved: boolean = false;
  is_quiz_saved: boolean = false;
  disable_save_button: boolean = true;
  disable_quiz_button: boolean = true;
  save_operation: boolean = false;
  msg_heading: string = "";
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
    this.msg_heading = this.translateService.get("PPT.msg_heading")["value"];
    // modal paramiters
    this._userid = localStorage.getItem("_userid");
    this.is_content_saved = this.navParams.data.res.is_content_saved;
    this.is_quiz_saved = this.navParams.data.res.is_quiz_saved;
    this.data = this.navParams.data.res.data;
    this.getTchTraaining_status(
      this.data.userid,
      this.data.moduleid,
      this.data.submoduleid,
      this.data.topicid
    );
  }

  async save_button_click() {
    this.save(this.data);
  }

  async getTchTraaining_status(uid, mid, sid, tid) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.gettchtrainingdetails(uid, mid, sid, tid).subscribe(
      (res) => {
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
      this.navController.navigateForward("/quiz", navigationExtras);
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
      this.navController.navigateForward(
        "/trainingcontentpreview",
        navigationExtras
      );
    }
  }

  async save(data) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.savetchtraining(data).subscribe(
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

  // showbutton: boolean = false;
  // enableSavebutton() {
  //     this.showbutton = true;
  // }
  // disableSavebutton() {
  //     this.showbutton = false;
  // }

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
