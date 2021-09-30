import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams,
} from "@ionic/angular";
import { RestApiService } from "./../../rest-api.service";
import { TranslateService } from "@ngx-translate/core";
import { HblRegisterPage } from "../hbl-register/hbl-register.page";

@Component({
  selector: "app-hbl-popover",
  templateUrl: "./hbl-popover.component.html",
  styleUrls: ["./hbl-popover.component.scss"],
})
export class HblPopoverComponent {
  res: any;
  userDetails: any = {};
  _userid: any;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private navParams: NavParams,
    private translateService: TranslateService
  ) {
    this._userid = localStorage.getItem("_userid");
    this.res = this.navParams.data.res;
    this.userDetails = this.res.userDetails;
    console.log(this.userDetails);
  }
}
