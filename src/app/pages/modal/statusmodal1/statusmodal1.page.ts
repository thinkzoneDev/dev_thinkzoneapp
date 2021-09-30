import { Component, OnInit } from "@angular/core";
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
// api
import { RestApiService } from "../../../rest-api.service";

@Component({
  selector: "app-statusmodal1",
  templateUrl: "./statusmodal1.page.html",
  styleUrls: ["./statusmodal1.page.scss"],
})
export class Statusmodal1Page implements OnInit {
  res: any;
  complete: any;
  name: any;
  percentage: any;
  language: string;
  module_data: any;
  showMessage: boolean;
  selected_moduleid: any;
  showMsg: boolean;
  _userid: any;
  _username: string;
  all_contents: any;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    public alertController: AlertController,
    private loadingController: LoadingController,
    public api: RestApiService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this.language = localStorage.getItem("_language");
    this.res = this.navParams.data.res;
    const { topicname } = this.res.submodule_details;
    this.name = topicname;
    console.log(this.res.submodule_details);

    this.getAllModule(this._userid, this.language);
  }

  ngOnInit() {}

  async getAllModule(userid, language) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getAllModule(userid, language).subscribe(
      (res) => {
        this.module_data = res;
        console.log("moduledata-->", this.module_data);
        if (this.module_data.length > 0) {
          this.module_data.forEach((element) => {
            this.getSubmoduleDetails(element.moduleid, language);
          });
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
      }
    );
  }

  async getSubmoduleDetails(moduleid, language) {
    await this.api.gettrainingcontents(moduleid, language).subscribe(
      (res) => {
        if (res.length > 0) {
          console.log("res-->", res);
          res.forEach((data) => {
            data.topicdetails.forEach((value) => {
              value.topic_percentage = "0%";
            });
          });
        }

        this.getUserDetails(res, this._userid, moduleid);
      },
      (err) => {}
    );
  }

  async getUserDetails(trainingdata, userid, moduleid) {
    await this.api.getmoduledetails(userid, moduleid, this.language).subscribe(
      (res) => {
        console.log("trainig data-->>", trainingdata);
        if (res.length > 0) {
          console.log("userdetails-->", res);
          trainingdata.forEach((data) => {
            data.topicdetails.forEach((value) => {
              console.log("value-->", value);
              value.topic_percentage = "0%";
              res.forEach((res) => {
                console.log("12345-->", res);
                if (res.topicid === this.res.submodule_details.topicid) {
                  this.percentage = res.topic_percentage;
                  if (this.percentage === "100%") {
                    this.complete = true;
                  } else this.complete = false;
                }
              });
            });
          });
        }
        this.all_contents = trainingdata;
      },
      (err) => {
        console.log(err);
      }
    );
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

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
