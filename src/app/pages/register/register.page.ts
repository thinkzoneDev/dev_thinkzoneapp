import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  AlertController,
  NavController,
  MenuController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { RestApiService } from "./../../rest-api.service";
import { TermsAndConditionsPage } from "../../terms-and-conditions/terms-and-conditions.page";
import { ServerDownService } from "src/app/services/server-down.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;

  username: string = "";
  email: string = "";
  gender: string;
  genderlist: any = ["male", "female"];
  dob: string;
  password: string = "";
  mobileno: string;
  passcode: string;
  usertype: string = "";
  usertypelist: any = ["anganwadi", "fellow", "school"];
  isAnganwadi: boolean = false;
  isFellow: boolean = false;
  isSchool: boolean = false;
  schoolNameList: any;
  schoolname: string = "ThinkZone School";
  udisecode: string = "21060711601";
  selectedSchool: any;
  anganwadiList: any;
  anganwadiName: string = "ThinkZone Anganwadi";
  anganwadiCode: string = "1234567890";
  selectedAnganwadi: any;
  managername: string = "";
  managerid: string = "";
  image: string = "/assets/img/default-user-profile-image.jpg";

  register_type: any = "";
  googleplus_userId: any = "";
  googleplus_displayName: any = "";
  googleplus_email: any = "";
  googleplus_givenName: any = "";
  googleplus_familyName: any = "";
  googleplus_imageUrl: any = "";

  infoAlert: string = "";
  usernameAlert: string = "";
  emailAlert: string = "";
  usertypeAlert: string = "";
  schoolAlert: string = "";
  genderAlert: string = "";
  dobAlert: string = "";
  phnoAlert: string = "";
  phnoValidAlert: string = "";
  passcodeAlert: string = "";

  confirmBox_header: string = "";
  confirmBox_msg: string = "";
  confirmBox_ok: string = "";
  confirmBox_cancel: string = "";
  progressSaved: boolean = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public alertController: AlertController,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    public api: RestApiService,
    private serverDownMsg: ServerDownService,
    private translateService: TranslateService
  ) {
    this.getAllSchools();
    this.getAllAnganwadis();

    this.route.queryParams.subscribe((params) => {
      // console.log("###Register page Queryparams: " + JSON.stringify(params));
      this.register_type = params.register_type
        ? params.register_type
        : "normal";

      if (this.register_type == "google") {
        this.googleplus_userId = params.googleplus_userId;
        this.googleplus_displayName = params.googleplus_displayName;
        this.googleplus_email = params.googleplus_email;
        this.googleplus_givenName = params.googleplus_givenName;
        this.googleplus_familyName = params.googleplus_familyName;
        this.googleplus_imageUrl = params.googleplus_imageUrl;

        this.username = this.googleplus_displayName;
        this.email = this.googleplus_email;
        this.image = this.googleplus_imageUrl;
      } else if (this.register_type == "normal") {
        this.googleplus_userId = "";
        this.googleplus_displayName = "";
        this.googleplus_email = "";
        this.googleplus_givenName = "";
        this.googleplus_familyName = "";

        this.username = "";
        this.email = "";
        this.image = "/assets/img/default-user-profile-image.png";
      } else {
        this.googleplus_userId = "";
        this.googleplus_displayName = "";
        this.googleplus_email = "";
        this.googleplus_givenName = "";
        this.googleplus_familyName = "";

        this.username = "";
        this.email = "";
        this.image = "/assets/img/default-user-profile-image.png";
      }
    });

    //Translator variables
    this.infoAlert = this.translateService.get("BASELINE.info")["value"];
    this.usernameAlert = this.translateService.get("REGISTER.usernameAlert")[
      "value"
    ];
    this.emailAlert = this.translateService.get("REGISTER.emailAlert")["value"];
    this.usertypeAlert = this.translateService.get("REGISTER.usertypeAlert")[
      "value"
    ];
    this.schoolAlert = this.translateService.get("REGISTER.schoolAlert")[
      "value"
    ];
    this.genderAlert = this.translateService.get("REGISTER.genderAlert")[
      "value"
    ];
    this.dobAlert = this.translateService.get("REGISTER.dobAlert")["value"];
    this.phnoAlert = this.translateService.get("REGISTER.phnoAlert")["value"];
    this.phnoValidAlert = this.translateService.get("REGISTER.phnoValidAlert")[
      "value"
    ];
    this.passcodeAlert = this.translateService.get("REGISTER.passcodeAlert")[
      "value"
    ];
    this.confirmBox_header = this.translateService.get("PPT.confirmBox_header")[
      "value"
    ];
    this.confirmBox_msg =
      this.translateService.get("PPT.confirmBox_msg")["value"];
    this.confirmBox_ok =
      this.translateService.get("PPT.confirmBox_ok")["value"];
    this.confirmBox_cancel = this.translateService.get("PPT.confirmBox_cancel")[
      "value"
    ];
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    /*this.onRegisterForm = this.formBuilder.group({
      'username': [null, Validators.compose([
        Validators.required
      ])],
      'email': [null, Validators.compose([
        Validators.required,
  	    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
      ])],
      'password': [null, Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)
      ])],
      'mobileno': [null, Validators.compose([
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ])],
      'passcode': [null, Validators.compose([
        Validators.required,
        Validators.pattern("^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$")
      ])]
    });
    */
  }

  async getAllSchools() {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getallschools().subscribe(
      (res) => {
        this.schoolNameList = res;
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async getAllAnganwadis() {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getallanganwadis().subscribe(
      (res) => {
        this.anganwadiList = res;
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  checkQuizStatus() {
    if (this.progressSaved == false) {
      this.confirmBox(this.confirmBox_header, "", this.confirmBox_msg);
    } else {
      this.goToLogin();
    }
  }

  gender_onchange(value) {
    this.gender = value;
  }

  dob_onhange(value) {
    this.dob = value;
  }

  select_usertype_onchange(userType) {
    if (userType == "anganwadi") {
      this.isAnganwadi = true;
      this.isFellow = false;
      this.isSchool = false;
    } else if (userType == "fellow") {
      this.isFellow = true;
      this.isAnganwadi = false;
      this.isSchool = false;
    } else if (userType == "school") {
      this.isSchool = true;
      this.isAnganwadi = false;
      this.isFellow = false;
    } else {
      // console.log("error");
    }
  }

  school_onchange(e) {
    this.schoolname = e.value.schoolname;
    this.udisecode = e.value.udisecode;
  }

  anganwadi_onchange(e) {
    this.anganwadiName = e.value.anganwadiname;
    this.anganwadiCode = e.value.anganwadicode;
  }

  async signUp() {
    const email_pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const phone_pattern = /^((\\+91-?)|0)?[0-9]{10}$/;
    if (
      this.username == undefined ||
      this.username == null ||
      this.username.trim() == ""
    ) {
      this.showAlert(this.infoAlert, "", this.usernameAlert);
    } else if (
      this.email == undefined ||
      this.email == null ||
      this.email.trim() == ""
    ) {
      this.showAlert(this.infoAlert, "", this.emailAlert);
    } else if (!email_pattern.test("" + this.email)) {
      this.showAlert(this.infoAlert, "", "Please enter a valid Email ID");
    } else if (
      this.gender == undefined ||
      this.gender == null ||
      this.gender == ""
    ) {
      this.showAlert(this.infoAlert, "", this.genderAlert);
    } else if (this.dob == undefined || this.dob == null || this.dob == "") {
      this.showAlert(this.infoAlert, "", this.dobAlert);
    } else if (
      this.mobileno == undefined ||
      this.mobileno == null ||
      this.mobileno == ""
    ) {
      this.showAlert(this.infoAlert, "", this.phnoAlert);
    } else if (!phone_pattern.test("" + this.mobileno)) {
      this.showAlert(this.infoAlert, "", this.phnoValidAlert);
    } else if (
      this.usertype == undefined ||
      this.usertype == null ||
      this.usertype == ""
    ) {
      this.showAlert(this.infoAlert, "", this.usertypeAlert);
    } else if (
      this.usertype == "school" &&
      this.schoolname == "ThinkZone School"
    ) {
      this.showAlert(this.infoAlert, "", this.schoolAlert);
    } else if (
      this.passcode == undefined ||
      this.passcode == null ||
      this.passcode == ""
    ) {
      this.showAlert(this.infoAlert, "", this.passcodeAlert);
    } else {
      this.checkpasscode();
    }
  }

  async checkpasscode() {
    const loading = await this.loadingController.create({
      spinner: "dots",
      duration: 5000,
    });
    await loading.present();
    await this.api.checkpasscode(this.passcode.toUpperCase()).subscribe(
      (res) => {
        if (Object.keys(res).length <= 0) {
          this.showAlert(
            "Info",
            "code: 001",
            "Server side error while validating Passcode."
          );
          loading.dismiss();
        } else {
          if (res["count"] == 0) {
            this.showAlert("Info", "", "Invalid Passcode.");
          } else if (res["count"] == 1) {
            console.log("check successful");
            this.managername = res.data[0].username;
            this.managerid = res.data[0].userid;
            let data = {
              teacherprofile: { status: "active" },
              username: this.username.toLowerCase(),
              userid: this.email.toLowerCase(),
              emailid: this.email.toLowerCase(),
              image: this.image,
              gender: this.gender,
              dob: this.dob,
              contactnumber: this.mobileno,
              usertype: this.usertype.toLowerCase(),
              schoolname: this.schoolname,
              udisecode: this.udisecode,
              anganwadiname: this.anganwadiName,
              anganwadicode: this.anganwadiCode,
              status: "active",
              passcode: this.passcode.toUpperCase(),
              managerid: this.managerid,
              managername: this.managername,
              permanentaddress: "",
              userpolicy: "agreed",
            };
            this.checkmobileavailability(data);
          } else {
            this.showAlert("Info", "code: 005", "Error validating Passcode.");
          }
        }
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async checkmobileavailability(data) {
    const loading = await this.loadingController.create({
      spinner: "dots",
      duration: 5000,
    });
    await loading.present();
    this.api.checkmobilenoavailability(this.mobileno).subscribe(
      (res) => {
        if (Object.keys(res).length <= 0) {
          this.showAlert(
            "Info",
            "code: 002",
            "Server side error while validating Mobile number."
          );
          loading.dismiss();
        } else {
          if (res["check"] == 0) {
            this.checkemailavailability(data);
          } else if (res["check"] == 1) {
            this.showAlert("Info", "", "Mobile number already registered.");
          } else {
            this.showAlert(
              "Info",
              "code: 004",
              "Error validating Mobile number."
            );
          }
          loading.dismiss();
        }
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async checkemailavailability(data) {
    const loading = await this.loadingController.create({
      spinner: "dots",
      duration: 5000,
    });
    await loading.present();
    this.api.checkemailavailability(this.email).subscribe(
      (res) => {
        // console.log("Response-->", res);
        if (Object.keys(res).length <= 0) {
          this.showAlert(
            "Info",
            "code: 002",
            "Server side error while validating Email."
          );
          loading.dismiss();
        } else {
          if (res["check"] == 0) {
            this.savedata(data);
          } else if (res["check"] == 1) {
            this.showAlert("Info", "", "EmailId already exist.");
          } else {
            this.showAlert("Info", "code: 004", "Error validating Email.");
          }
          loading.dismiss();
        }
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async savedata(data) {
    console.log("save user data --->>>", data);
    const loading = await this.loadingController.create({
      spinner: "dots",
      duration: 5000,
    });
    await loading.present();
    this.api.saveuser(data).subscribe(
      (res) => {
        if (Object.keys(res).length > 0) {
          let saveresdata = res.data;
          loading.dismiss();
          this.showAlert("Success", "", "User registered successfully.");
          //this.goToLogin();
          this.goToDashboard(saveresdata);
        }
      },
      (err) => {
        loading.dismiss();
        this.showAlert(
          "Info",
          "code: 003",
          "Server side error while Saving data."
        );
      }
    );
  }

  async goToDashboard(data) {
    localStorage.setItem("_userid", this.email);
    localStorage.setItem("_username", this.username);
    localStorage.setItem("_usertype", this.usertype);
    localStorage.setItem("_profile_image", this.image);
    localStorage.setItem("_emailid", this.email);
    localStorage.setItem("_passcode", this.passcode);
    localStorage.setItem("_school", this.schoolname);
    localStorage.setItem("_udise", this.udisecode);

    this.navCtrl.navigateRoot("/");
  }

  goToLogin() {
    this.navCtrl.navigateRoot("/login");
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

  async confirmBox(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: this.confirmBox_cancel,
          role: "cancel",
          handler: () => {},
        },
        {
          text: this.confirmBox_ok,
          handler: () => {
            this.goToLogin();
          },
        },
      ],
    });
    await alert.present();
  }
}
