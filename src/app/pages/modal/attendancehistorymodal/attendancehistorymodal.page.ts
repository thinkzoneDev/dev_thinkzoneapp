import { Component, NgZone } from "@angular/core";
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

// Geolocation
//import { Geolocation } from '@ionic-native/geolocation/ngx';

// Modals
import { RestApiService } from "./../../../rest-api.service";

@Component({
  selector: "app-attendancehistorymodal",
  templateUrl: "./attendancehistorymodal.page.html",
  styleUrls: ["./attendancehistorymodal.page.scss"],
})
export class AttendancehistorymodalPage {
  res: any;
  toolbarshadow = true;

  attendance_list: any = [];
  attendance_date: string = new Date().toISOString();
  _userid: string;
  _centerid: string;
  _centername: string;

  is_Holiday: boolean = false;

  present = 0;
  total = 0;
  absent = 0;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    public navParams: NavParams
  ) {
    // modal paramiters
    this.res = this.navParams.data.res;

    this._userid = this.res.userid;
    this.attendance_date = this.res.date;
    this._centerid = "";
    this._centername = "";
    // this.getGeolocation();  // commented by nrusingh on 4.11.2019 since app was slow down in low network area
    this.getattendancehistory();
  }

  // get student list
  async getattendancehistory() {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .getattendanceofteacherbydate(this._userid, this.attendance_date)
      .subscribe(
        (res) => {
          this.attendance_list = res;
          if (
            this.attendance_list != null &&
            this.attendance_list != undefined &&
            this.attendance_list.length > 0
          ) {
            this.total = this.attendance_list.length;
            this.attendance_list.forEach((element) => {
              if (element.isholiday) {
                this.is_Holiday = true;
                return;
              } else {
                this.is_Holiday = false;
                if (element.availability == "present") {
                  this.present++;
                } else {
                  this.absent++;
                }
              }
            });
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
        }
      );
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

  // close modal
  closeModal() {
    this.modalController.dismiss({ data: "Cancel" });
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
}
