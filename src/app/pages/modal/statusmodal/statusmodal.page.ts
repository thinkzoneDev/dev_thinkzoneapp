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
  selector: "app-statusmodal",
  templateUrl: "./statusmodal.page.html",
  styleUrls: ["./statusmodal.page.scss"],
})
export class StatusmodalPage implements OnInit {
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
    console.log("responce", this.res);

    const {
      submodulename,
      submoduleid,
      modulename,
      moduleid,
      topic_percentage,
      topicid,
      topicname,
    } = this.res.submodule_details;

    this.name = topicname;
    this.getSubmoduleDetails(moduleid, this.language);
  }

  ngOnInit() {}

  async getSubmoduleDetails(moduleid, language) {
    const loading = await this.loadingController.create({});
    await loading.present();
    this.selected_moduleid = moduleid;
    await this.api.getppttrainingcontents(moduleid, language).subscribe(
      (res) => {
        if (res.length > 0) {
          console.log("1st-->", res);
          res.forEach((data) => {
            data.topicdetails.forEach((value) => {
              value.topic_percentage = "0%";
            });
          });
        } else {
        }
        loading.dismiss();
        this.getUserDetails(res, this._userid, moduleid);
      },
      (err) => {
        this.showAlert("Module Error", "", "Unable to fetch Module details");
        loading.dismiss();
      }
    );
  }

  async getUserDetails(trainingdata, userid, moduleid) {
    console.log("trainig data", trainingdata);
    await this.api
      .getpptmoduledetails(userid, moduleid, this.language)
      .subscribe(
        (res) => {
          if (res.length > 0) {
            console.log("-->>", res);
            if (trainingdata.length == 0) {
              this.percentage = "0%";
            } else {
              trainingdata.forEach((data) => {
                data.topicdetails.forEach((value) => {
                  value.topic_percentage = "0%";
                  this.percentage = "0%";
                  res.forEach((res) => {
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
          } else {
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
