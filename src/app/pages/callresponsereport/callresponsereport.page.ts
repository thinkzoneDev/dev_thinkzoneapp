import { Component } from "@angular/core";
import {
  AlertController,
  LoadingController,
  ToastController,
} from "@ionic/angular";
import { RestApiService } from "src/app/rest-api.service";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-callresponsereport",
  templateUrl: "./callresponsereport.page.html",
  styleUrls: ["./callresponsereport.page.scss"],
})
export class CallresponsereportPage {
  userid: string;
  language: string;
  monthlist = [
    { name: "january", value: 1 },
    { name: "febuary", value: 2 },
    { name: "march", value: 3 },
    { name: "april", value: 4 },
    { name: "may", value: 5 },
    { name: "june", value: 6 },
    { name: "july", value: 7 },
    { name: "august", value: 8 },
    { name: "september", value: 9 },
    { name: "october", value: 10 },
    { name: "november", value: 11 },
    { name: "december", value: 12 },
  ];

  month: number;
  year: number = 2021;
  report: any;
  phone: any;

  constructor(
    public api: RestApiService,
    private loadingController: LoadingController,
    public alertController: AlertController,
    private serverDownMsg: ServerDownService
  ) {
    this.userid = localStorage.getItem("_userid");
    this.language = localStorage.getItem("_language");
  }

  monthOnChange(month) {
    this.report = [];
    this.month = month;
    this.getpostcallreport();
  }

  async getpostcallreport() {
    console.log(
      "check report data",
      this.userid,
      this.language,
      this.month,
      this.year
    );

    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .getpostcallactivitiesbyuserid(
        this.userid,
        this.language,
        this.month,
        this.year
      )
      .subscribe(
        (res) => {
          console.log("check report res", res);
          if (res.length == 0) {
            this.showAlert("Info", "", "No Record Found");
          } else {
            this.report = res;
          }
          // this.showPhonenumber();
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  showPhonenumber() {
    this.report.forEach((r) => {
      r.detailsarr.forEach((e) => {
        console.log("check phone", e.phonenumber);
        this.phone = e.phonenumber;
        console.log("check phoneno", this.phone);
      });
    });
  }

  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }
}
