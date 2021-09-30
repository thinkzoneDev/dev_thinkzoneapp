import { Component, OnInit } from "@angular/core";
import {
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController,
  ModalController,
  NavParams,
} from "@ionic/angular";
import { RestApiService } from "./../rest-api.service";
@Component({
  selector: "app-terms-and-conditions",
  templateUrl: "./terms-and-conditions.page.html",
  styleUrls: ["./terms-and-conditions.page.scss"],
})
export class TermsAndConditionsPage implements OnInit {
  _id: string = "";
  toolbarshadow = true;

  constructor(
    public navParams: NavParams,
    public loadingController: LoadingController,
    public navController: NavController,
    public modalCtrl: ModalController,
    public api: RestApiService
  ) {
    this._id = this.navParams.get("_id");
    // console.log('--> _id: '+ this._id)
  }
  ngOnInit() {}

  async onContinue() {
    const loading = await this.loadingController.create({
      spinner: "dots",
    });
    await loading.present();
    const data = {
      userpolicy: "agreed",
    };
    await this.api.updateuser(this._id, data).subscribe(
      (res) => {
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
      }
    );

    this.navController.navigateRoot("/");
    this.modalCtrl.dismiss();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
