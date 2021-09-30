import { Component } from "@angular/core";
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

import { EditProfilePage } from "../edit-profile/edit-profile.page";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage {
  public profile_data: any = [];

  // Data
  "image": "https://shared001.s3.us-east-2.amazonaws.com/1584793889053.jpg";
  _id: string = "";
  username: string = "";
  usertype: string = "";
  gender: string = "";
  dob: string = "";
  regdate: string = "";
  emailid: string = "";
  contactno: string = "";
  address: string = "";
  block: string = "";
  district: string = "";
  state: string = "";
  userimage: string = "";
  bdate;
  bmonth;
  byear;

  rdate;
  rmonth;
  ryear;
  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  profile_image: any;
  _userid: string;
  _username: string;
  managername: string;
  toolbarshadow = true;
  hide_class_field: boolean = false;
  qualification: any;

  stateid: any = "20";
  districtid: any = "";
  blockid: any = "";
  districts_arr: any = [];
  blocks_arr: any = [];

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this.getUserProfile();
  }

  async getUserProfile() {
    let loading = await this.loadingController.create({
      spinner: "dots",
      duration: 5000,
    });
    await loading.present();
    this.api.getuserbyuserid(this._userid).subscribe(
      (res) => {
        console.log(res);
        this.profile_data = res;
        console.log("Data", this.profile_data);
        if (this.profile_data.length > 0) {
          this._id = this.profile_data[0]._id;
          this.username = this.profile_data[0].username;
          this.usertype = this.profile_data[0].usertype;
          this.managername = this.profile_data[0].managername;
          this.gender = this.profile_data[0].gender;
          this.dob = this.profile_data[0].dob;
          this.regdate = this.profile_data[0].createdon;
          this.emailid = this.profile_data[0].emailid;
          this.contactno = this.profile_data[0].contactnumber;
          this.address = this.profile_data[0].permanentaddress;
          this.userimage = this.profile_data[0].image;
          this.qualification = this.profile_data[0].qualification;
          this.block = this.profile_data[0].blockname;
          this.state = this.profile_data[0].statename;
          this.district = this.profile_data[0].districtname;

          this.stateid = this.profile_data[0].stateid
            ? this.profile_data[0].stateid
            : "20";
          this.districtid = this.profile_data[0].districtid
            ? this.profile_data[0].districtid
            : "1";
          this.blockid = this.profile_data[0].blockid
            ? this.profile_data[0].blockid
            : "";
          this.getAllDistrictData(this.stateid);
          this.getAllBlockData(this.stateid, this.districtid);
          this.resolveDOB();
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.showAlert(
          "Profile Error",
          "",
          "Unable to fetch user profile by this time"
        );
      }
    );
  }

  resolveDOB() {
    if (this.dob !== null) {
      let dt = new Date(this.dob);
      this.bdate = dt.getDate();
      this.bmonth = this.months[dt.getMonth()];
      this.byear = dt.getFullYear();
    } else {
      this.dob = "";
    }

    let dt = new Date(this.regdate);
    this.rdate = dt.getDate();
    this.rmonth = this.months[dt.getMonth()];
    this.ryear = dt.getFullYear();
  }

  async getAllDistrictData(stateid) {
    const loading = await this.loadingController.create({
      spinner: "dots",
      duration: 3000,
    });
    await loading.present();
    this.api.getAllStateData(stateid).subscribe(
      (res) => {
        loading.dismiss();
        this.districts_arr = res;
      },
      (err) => {
        console.log(err);
        this.districts_arr = [];
        loading.dismiss();
      }
    );
  }

  async getAllBlockData(stateid, districtid) {
    this.api.getBlockData(stateid, districtid).subscribe(
      (res) => {
        this.blocks_arr = res;
      },
      (err) => {
        console.log(err);
        this.blocks_arr = [];
      }
    );
  }

  async goToEditPage() {
    const modal = await this.modalController.create({
      component: EditProfilePage,
      componentProps: {
        res: {
          profileObj: this.profile_data,
          districts_arr: this.districts_arr,
          blocks_arr: this.blocks_arr,
        },
      },
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {
      this.getUserProfile();
    });
    return await modal.present();
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

  // confirm box
  async showConfirm(
    header: string,
    subHeader: string,
    message: string,
    body: any
  ) {
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

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
}
