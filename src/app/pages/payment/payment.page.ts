import { Component, OnInit } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { ServerDownService } from "src/app/services/server-down.service";

import { RestApiService } from "./../../rest-api.service";

@Component({
  selector: "app-feedback",
  templateUrl: "./payment.page.html",
  styleUrls: ["./payment.page.scss"],
})
export class PaymentPage implements OnInit {
  respons: any;
  main_arr: any = [];
  toolbarshadow = true;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private serverDownMsg: ServerDownService
  ) {}

  ngOnInit() {
    this.getResponse();
  }

  async getResponse() {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getallpaymentinfo().subscribe(
      (res) => {
        loading.dismiss();
        this.respons = res;
        // this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async save() {
    if (
      this.main_arr.length <= 0 ||
      this.main_arr.length < this.respons.length
    ) {
      this.showAlert("Payment Info", "", "Please enter all payment info");
    } else {
      const body = {
        userid: localStorage.getItem("_userid"),
        username: localStorage.getItem("_username"),
        centerid: localStorage.getItem("_centerid"),
        centername: localStorage.getItem("_centername"),
        paymentinfo: this.main_arr,
      };
      const loading = await this.loadingController.create({ duration: 5000 });
      await loading.present();
      await this.api.createpaymentinfomgr(body).subscribe(
        (res) => {
          loading.dismiss();
          if (res["status"]) {
            this.showAlert(
              "Payment Info",
              "Payment Info",
              "Payment Info saved Successfully"
            );
          }
          //   this.showAlert('Payment Info', 'Payment Info', 'Payment Info saved ' + res['status'] + ' !!!');
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
      this.navCtrl.navigateBack("/center");
    }
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

  // =====================================
  selectOnChange_single(data: any, answer: any) {
    const answer_arr = [];
    answer_arr.push(answer);
    const newfeed = {
      _id: data._id,
      id: data.id,
      payment_q: data.payment,
      payment_a: answer_arr,
    };
    this.insertIntoArray(data._id, newfeed);
  }

  selectOnChange_multiple(data: any, answer: any) {
    const newfeed = {
      _id: data._id,
      id: data.id,
      payment_q: data.payment,
      payment_a: answer,
    };
    this.insertIntoArray(data._id, newfeed);
  }

  dateOnChange(data: any, answer: any) {
    const answer_arr = [];
    answer_arr.push(answer);
    const newfeed = {
      _id: data._id,
      id: data.id,
      payment_q: data.payment,
      payment_a: answer_arr,
    };
    this.insertIntoArray(data._id, newfeed);
  }

  inputOnchange(data: any, answer: any) {
    const answer_arr = [];
    answer_arr.push(answer);
    const newfeed = {
      _id: data._id,
      id: data.id,
      payment_q: data.payment,
      payment_a: answer_arr,
    };
    this.insertIntoArray(data._id, newfeed);
  }

  insertIntoArray(_id, newfeed) {
    let ele_found = false;
    let index = 0,
      i = 0;
    this.main_arr.forEach((ele) => {
      if (ele["_id"] === _id) {
        ele_found = true;
        index = i;
        return;
      }
      i++;
    });

    if (ele_found) {
      this.main_arr.splice(index, 1);
      this.main_arr.push(newfeed);
    } else {
      this.main_arr.push(newfeed);
    }
  }
  // =====================================
  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
}
