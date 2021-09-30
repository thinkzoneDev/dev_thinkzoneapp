import { Component, OnInit } from "@angular/core";
import { flatten } from "@angular/core/src/render3/util";
import {
  AlertController,
  LoadingController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { RestApiService } from "src/app/rest-api.service";
import { HblPopoverComponent } from "../hbl-popover/hbl-popover.component";

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.page.html",
  styleUrls: ["./leaderboard.page.scss"],
})
export class LeaderboardPage implements OnInit {
  toolbarshadow: boolean;
  index = 1;
  language: string;
  user_restScore: any;
  profile_data: any;
  userimage: any;
  _userid: string;
  _username: string;
  user_score: any;
  user_found: boolean;
  alldata: any;
  user_available: boolean;
  month: number;
  year: number;

  constructor(
    public api: RestApiService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public navController: NavController,
    public popoverCtrl: PopoverController
  ) {
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    console.log(this.month, this.year);
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this.language = localStorage.getItem("_language");
    this.getLeaderBoardData(this.language);
  }

  ngOnInit() {}

  async getLeaderBoardData(language) {
    let current_date = new Date();
    let current_month = current_date.getMonth() + 1;
    let current_year = current_date.getFullYear();
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .getLeaderBoardData(null, language, current_month, current_year)
      .subscribe(
        (res) => {
          if (res.length > 0) {
            this.alldata = res;
            console.log(this.alldata);
            res.forEach((element) => {
              if (element.userid == this._userid) {
                this.userimage = element.image;
                this.user_score = element.finalrank;
                this.user_found = true;
                if (this.user_found == true) {
                  this.user_available = true;
                }
              }
            });
          }
          loading.dismiss();
        },
        (err) => {
          this.showAlert("Status", "", "Unable to fetch Leaderboard data");
          loading.dismiss();
        }
      );
  }

  async openUserPopup(user) {
    console.log(user);
    const popover = await this.popoverCtrl.create({
      component: HblPopoverComponent,
      cssClass: "contact-popover",
      componentProps: {
        res: {
          userDetails: user,
        },
      },
      // event: ev,
      showBackdrop: true,
      translucent: true,
      animated: true,
    });
    popover.onDidDismiss().then(() => {});
    return await popover.present();
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }

  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ["Ok"],
    });
    await alert.present();
  }
}
