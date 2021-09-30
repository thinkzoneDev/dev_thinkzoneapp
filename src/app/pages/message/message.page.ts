import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
} from "@ionic/angular";

import { RestApiService } from "./../../rest-api.service";
import { MessagebodyPage } from "./../modal/messagebody/messagebody.page";
import { UserUnreadMessageService } from "./../../services/userunreadmessage.service";
import { HolidaymodalPage } from "../modal/holidaymodal/holidaymodal.page";
@Component({
  selector: "app-message",
  templateUrl: "./message.page.html",
  styleUrls: ["./message.page.scss"],
})
export class MessagePage implements OnInit {
  isUnread = false;

  userid: string = localStorage.getItem("_userid");
  respons: any;
  toolbarshadow = true;
  searchText: any;
  notification_bkp: any;
  nomessage: boolean;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private userunreadmessage: UserUnreadMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getResponse();
  }

  async getResponse() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getmessagesbyuserid(this.userid).subscribe(
      (res) => {
        loading.dismiss();
        this.respons = res;
        this.notification_bkp = this.respons;
        if (res.length === 0) {
          this.nomessage = true;
          //this.showConfirm("Inbox empty", "", "No messages found.");
        } else {
        }

        // this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');
      },
      (err) => {
        loading.dismiss();
      }
    );
  }
  //delete message
  async deleteMessage(deleteid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.deletemessage(deleteid).subscribe(
      (res) => {
        this.showConfirm(
          "Confirmation !!!",
          "",
          "message deleted successfully"
        );
        loading.dismiss();
        this.getResponse();
        this.respons = res;
      },
      (err) => {
        loading.dismiss();
      }
    );
  }
  async showConfirm(header: string, subHeader: string, message: string) {
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
  async openMessage(res) {
    // this.userunreadmessage.updateuserunreadmessage();
    const modal = await this.modalController.create({
      component: MessagebodyPage,
      componentProps: { res: res },
      cssClass: "half-modal-message", // <-- this is used to pass data from  this page to the modal page that will open on click
    });
    this.updateMessageStatus(res);
    return await modal.present();
  }
  async updateMessageStatus(res) {
    if (res["status"] === "unread") {
      const _id = res["_id"];
      const id = res["id"];
      const userid = res["userid"];
      const title = res["title"];
      const message = res["message"];
      const status = "read";
      const readon = new Date();

      const body = {
        id: id,
        userid: userid,
        title: title,
        message: message,
        status: status,
        readon: readon,
      };

      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.updatemessagebyid(_id, body).subscribe(
        (res) => {
          loading.dismiss();
          // this.getResponse();
        },
        (err) => {
          loading.dismiss();
        }
      );
      this.getResponse();
    }
  }
  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }

  onSearch(event) {
    const input = (this.searchText = event.target.value);

    if (input != null && input != undefined && input.length >= 0) {
      console.log("if");
      let array = this.notification_bkp.filter((item) => {
        return item.title
          .toLocaleLowerCase()
          .includes(input.toLocaleLowerCase());
      });
      this.respons = array;
    } else {
      console.log("else");
      this.respons = this.notification_bkp;
    }
  }

  ionClear() {
    this.respons = this.notification_bkp;
  }

  gotohomepage() {
    this.router.navigate(["/home-results"]);
    // this.navCtrl.navigateForward('/home-results');
  }
}
