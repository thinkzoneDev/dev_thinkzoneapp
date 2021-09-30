import { Component, OnInit } from "@angular/core";
import { RestApiService } from "./../rest-api.service";
import {
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { Location } from "@angular/common";
import { ServerDownService } from "../services/server-down.service";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.page.html",
  styleUrls: ["./feedback.page.scss"],
})
export class FeedbackPage implements OnInit {
  _userid: string;
  is_like: Boolean = true;
  activity_name: string;
  feedback: string;
  validate: Boolean = false;
  value: any;

  constructor(
    public api: RestApiService,
    private loadingController: LoadingController,
    private location: Location,
    private navCtrl: NavController,
    private serverDownMsg: ServerDownService
  ) {
    this._userid = localStorage.getItem("_userid");
  }

  ngOnInit() {
    //this.feedback_update()
    this.getfeedback();
  }

  async feedback_update() {
    {
      const body = {
        userid: this._userid,
        is_like: this.is_like,
        activity_name: "hd",
        feedback: this.feedback,
      };
      const loading = await this.loadingController.create({ duration: 5000 });
      await loading.present();
      await this.api.savetchfeedback(body).subscribe(
        (res) => {
          loading.dismiss();
          // this.location.back();
          this.navCtrl.pop();
        },
        (err) => {
          loading.dismiss();
          this.navCtrl.pop();
          this.serverDownMsg.presentToast();
        }
      );
      //this.nav
    }
  }

  async getfeedback() {
    let body = {};
    await this.api.gettchfeedback(body).subscribe(
      (res) => {
        this.value = res;
        this.is_like = this.value.is_like;
        this.feedback = this.value.feedback;
      },
      (err) => {
        this.serverDownMsg.presentToast();
      }
    );
  }

  likef() {
    this.is_like = true;
    this.validate = true;
  }

  dislikef() {
    this.is_like = false;
    this.validate = true;
  }

  getvalue() {
    if (this.is_like) {
      return "liked-chip";
    } else {
      return "unliked-chip";
    }
  }

  getdvalue() {
    if (this.is_like == false) {
      return "liked-chip";
    } else {
      return "unliked-chip";
    }
  }
}
