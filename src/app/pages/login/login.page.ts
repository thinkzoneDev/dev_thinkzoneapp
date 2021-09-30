import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  Platform,
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { NavigationExtras } from "@angular/router";
import { RestApiService } from "./../../rest-api.service";
import { SigninPage } from "./../modal/signin/signin.page";
import { TermsAndConditionsPage } from "../../terms-and-conditions/terms-and-conditions.page";

// Google Signin
//mobile
import { GooglePlus } from "@ionic-native/google-plus/ngx";
//web
import { SocialAuthService, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  public loginFormGroup: FormGroup;
  public loginState = 0;
  public signinFormGroup: FormGroup;
  _status = true;
  _message = "";
  profImg = "";
  fcm_token: any = localStorage.getItem("fcm_token");
  fcm_rtoken: string = localStorage.getItem("fcm_rtoken");
  errormessage: string = "";
  @Input() value: any;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public api: RestApiService,
    public modalController: ModalController,
    public googlePlus: GooglePlus,
    public platform: Platform,
    public socialAuthService: SocialAuthService
  ) {
    this.signinFormGroup = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
    this.errormessage = "";
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  // ngOnInit() {
  //   this.loginFormGroup = this.formBuilder.group({
  //     'email': [null, Validators.compose([
  //       Validators.required
  //     ])],
  //     'password': [null, Validators.compose([
  //       Validators.required
  //     ])]
  //   });
  // }

  // on logging in
  // async onLoggedin() {
  //     const data = {
  //       userid: this.loginFormGroup.value.email,
  //       password: this.loginFormGroup.value.password,
  //       usertype: 'manager'
  //     };
  //     await loading.present();
  //     await this.api.authenticateuser(data)
  //       .subscribe(res => {
  //         loading.dismiss();
  //         if ( res['success'] === 'success' ) {
  //           localStorage.setItem('_userid', res['userid']);
  //           localStorage.setItem('_username', res['username']);
  //           localStorage.setItem('_emailid', res['emailid']);
  //           this.navController.navigateRoot('/home-results');
  //         }
  //       }, err => {
  //         loading.dismiss();
  //       });
  // }

  // async forgotPass() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Forgot Password?',
  //     message: 'Enter you email address to send a reset link password.',
  //     inputs: [
  //       {
  //         name: 'email',
  //         type: 'email',
  //         placeholder: 'Email'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //         }
  //       }, {
  //         text: 'Confirm',
  //         handler: async () => {
  //           const loader = await this.loadingController.create({
  //             duration: 2000
  //           });

  //           loader.present();
  //           loader.onWillDismiss().then(async l => {
  //             const toast = await this.toastCtrl.create({
  //               showCloseButton: true,
  //               message: 'Email was sended successfully.',
  //               duration: 3000,
  //               position: 'bottom'
  //             });

  //             toast.present();
  //           });
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  // // //
  // goToRegister() {
  //   this.navController.navigateForward('/register');
  // }

  // async openModal() {
  //   const modal = await this.modalController.create({
  //     component: SigninPage
  //   });
  //   return await modal.present();
  // }

  goToNextPage() {
    // if (this.loginState === 0) {
    //   this.loginState = 1;
    //   return;
    // }

    const data = {
      userid: this.signinFormGroup.value.email,
      password: this.signinFormGroup.value.password,
      usertype: "teacher",
    };
    this.signin(data);
  }

  // The Code below has been copied from SigninPage modal
  ngOnInit() {
    this.signinFormGroup = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });
  }

  async signin(data) {
    this._status = true;

    const loading = await this.loadingController.create({
      spinner: "dots",
      duration: 5000,
    });
    await loading.present();
    await this.api.authenticateuser(data).subscribe(
      (res) => {
        loading.dismiss();
        console.log("--> Login res: " + JSON.stringify(res));
        if (res["success"] === "success") {
          this._status = true;
          this._message = "";
          const uid = res["userid"];
          const uname = res["username"];
          const userpolicy = res["userpolicy"];
          const _id = res["_id"];
          localStorage.setItem("_regdate", res["regdate"]);
          localStorage.setItem("_userid", res["userid"]);
          localStorage.setItem("_username", res["username"]);
          localStorage.setItem("_emailid", res["emailid"]);
          localStorage.setItem("_profile_image", res["image"]);
          // localStorage.setItem("_password", this.signinFormGroup.value.password);
          localStorage.setItem("_usertype", res["usertype"]);

          // added by nrusingh on 03-feb-2021 for guest user feature
          if (data.userid == "guest@thinkzone.in")
            localStorage.setItem("_isguestuser", "yes");
          else localStorage.setItem("_isguestuser", "no");
          //---------------------------------------------------------

          // save token id ------------------------------------------
          /*this.api.getfcmtokenidbyuserid(uid).subscribe(res1 => {
            if (res1.length > 0) {
              const tid = res1[0]['_id'];
              const obj = {
                userid: uid,
                username: uname,
                token:localStorage.getItem('fcm_token'),
                refresh_token: localStorage.getItem('fcm_rtoken')
              };
              console.log("tid",tid,localStorage.getItem('fcm_token'),localStorage.getItem('fcm_rtoken'))
              this.api.updatefcmtokenid(tid, obj).subscribe(res2 => {
                console.log("###update token response: ",JSON.stringify(res2));
              });
            } else {
              const obj = {
                userid: uid,
                username: uname,
                token: localStorage.getItem('fcm_token'),
                refresh_token: localStorage.getItem('fcm_rtoken')
              };
              this.api.createnewfcmtokenid(obj).subscribe(res3 => {
                console.log("###save token response: ",JSON.stringify(res3));
              });
            }
          }, err => {
            this._status = false;
            this._message = 'LOGIN.conerror';
            loading.dismiss();
          });
          */
          // -------------------------------------------------
          if (res["usertype"] == "fellow") {
            if (
              userpolicy == undefined ||
              userpolicy == null ||
              userpolicy == "disagreed"
            ) {
              this.callingModel(_id); // <-- Terms & Conditions Modal
            } else {
              this.navController.navigateRoot("/"); // <-- Navigate to Dashboard
            }
          } else {
            this.navController.navigateRoot("/"); // <-- Navigate to Dashboard
          }
        } else {
          // alert("User not authenticated");
          this._status = false;
          this._message = "LOGIN.invalidcred";
        }
      },
      (err) => {
        this._status = false;
        this._message = "LOGIN.conerror";
        loading.dismiss();
      }
    );
  }

  async callingModel(_id) {
    const modal = await this.modalController.create({
      component: TermsAndConditionsPage,
      componentProps: { _id: _id },
    });
    return await modal.present();
  }

  // Register link clicked
  register_click() {
    //this.navController.navigateForward('/register');
    let navigationExtras: NavigationExtras = {
      queryParams: {
        register_type: "normal",
        googleplus_res: {},
      },
    };
    this.navController.navigateForward(["register"], navigationExtras);
  }

  // Guest login link clicked
  async guestlogin_click() {
    // commented by nrusingh on 02-02-2021 for guest login feature modification
    /*
    this._status = true;
    this._message = '';
    const uid = 'guest';
    const uname = 'guest';
    localStorage.setItem('_userid', uid);
    localStorage.setItem('_username', uname);
    localStorage.setItem('_emailid', uid);
    localStorage.setItem('_image', '');
    localStorage.setItem('_password', 'guest');
    localStorage.setItem('_usertype', 'guest');
    this.navController.navigateRoot('/home-results2');
    this.showConfirm('Guest login', '', '<b>You will be logged in as a guest. <br> Do you want to proceed?</b>');
    */
    //---------------
    const loginalert = await this.alertController.create({
      header: "Sign In",
      backdropDismiss: false, //<-- to disable closing alert when clicking outside
      inputs: [
        {
          placeholder: "User ID",
          name: "email",
          type: "text",
        },
        {
          placeholder: "Password",
          name: "password",
          type: "password",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Signin",
          handler: (data) => {
            let email = data.email;
            let password = data.password;
            // console.log(
            //   "@@@input email---",
            //   email + "    input password---",
            //   password
            // );

            if (
              email == undefined ||
              email == null ||
              email.trim().length <= 0
            ) {
              alert("Invalid email format");
            } else if (
              password == undefined ||
              password == null ||
              password.trim().length <= 0
            ) {
              alert("Invalid password format");
            } else {
              const params = {
                userid: email,
                password: password,
                usertype: "teacher",
              };
              this.signin(params);
            }
          },
        },
      ],
    });
    await loginalert.present();
  }

  // confirm box
  async showConfirm(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      backdropDismiss: false, //<-- to disable closing alert when clicking outside
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Yes",
          handler: () => {
            const data = {
              userid: "guest@thinkzone.in",
              password: "guest",
              usertype: "teacher",
            };
            this.signin(data);
          },
        },
      ],
    });
    await alert.present();
  }

  // Google Sign-in method
  signInWithGoogle(): void {
    // console.log("-->Platform: ", this.platform);
    if (this.platform.is("cordova")) {
      // <-------------------- Mobile Login
      // Get fingerprint (optional)
      this.googlePlus.getSigningCertificateFingerprint().then((result) => {
        //alert("fingerprint: " + JSON.stringify(result));
        //console.log("fingerprint: ", result);
      });

      // Logout from any previous login
      this.signoutGoogle();

      // Login
      let login_obj = {};
      //login_obj = { 'scopes': '', 'webClientId': '241519412611-btifq46eoq3v14ql3sep5qiemophu2gj.apps.googleusercontent.com', 'offline': true }

      // <-------------------- Phone Login
      this.googlePlus
        .login(login_obj)
        .then((res) => {
          this.profImg = res.hasOwnProperty("imageUrl")
            ? res.imageUrl
            : "/assets/img/default-user-profile-image.png";
          console.log("check login res", res);
          // alert("Login success1: " + JSON.stringify(res));
          localStorage.setItem("_profile_image", this.profImg);
          localStorage.setItem("_username", res.displayName);
          this.checkemailavailability("loginviamobile", res);
        })
        .catch((err) => {
          // alert("Login Error: " + err);
          // console.log("Login Error", err);
        });
    } else {
      // <-------------------- Browser Login
      console.log("Login local->", localStorage);
      this.socialAuthService
        .signIn(GoogleLoginProvider.PROVIDER_ID)
        .then((res) => {
          this.profImg = res.hasOwnProperty("photoUrl")
            ? res.photoUrl
            : "/assets/img/default-user-profile-image.png";
          console.log("Login success2: ", res);
          localStorage.setItem("_profile_image", this.profImg);
          localStorage.setItem("_username", res.name);
          this.checkemailavailability("loginviabrowser", res);
        })
        .catch((err) => {
          //alert("Login Error: " + err);
          console.log("Login Error", err);
        });
    }
  }

  async checkemailavailability(loginviaflag, googleplusobj) {
    // console.log(
    //   "--> Inside checkemailavailability(googleplusobj). googleplusobj= " +
    //     JSON.stringify(googleplusobj)
    // );
    let email = googleplusobj.email;
    this._status = true;
    const loading = await this.loadingController.create({
      spinner: "dots",
      duration: 5000,
    });
    await loading.present();
    await this.api.getuserbyuserid(email).subscribe(
      (res) => {
        loading.dismiss();
        // console.log(
        //   "--> api.getuserbyuserid(email) res: " + JSON.stringify(res)
        // );
        console.log("if res-->", res);
        if (Object.keys(res).length > 0) {
          let resobj = res[0];
          console.log("res-->", resobj);
          if (Object.keys(resobj).length > 0) {
            this._status = true;
            this._message = "";
            localStorage.setItem("_userid", resobj["userid"]);
            localStorage.setItem("_username", resobj["username"]);
            localStorage.setItem("_passcode", resobj["passcode"]);
            localStorage.setItem("_emailid", resobj["emailid"]);
            localStorage.setItem("_image", resobj["image"]);
            localStorage.setItem("_profile_image", this.profImg);
            localStorage.setItem("_usertype", resobj["usertype"]);
            localStorage.setItem("_school", resobj["schoolname"]);
            localStorage.setItem("_udise", resobj["udisecode"]);
            if (resobj.userid == "guest@thinkzone.in")
              localStorage.setItem("_isguestuser", "yes");
            else localStorage.setItem("_isguestuser", "no");

            const userpolicy = resobj["userpolicy"];
            const _id = resobj["_id"];
            if (resobj["usertype"] == "fellow") {
              if (
                userpolicy == undefined ||
                userpolicy == null ||
                userpolicy == "disagreed"
              ) {
                this.callingModel(_id); // <-- Terms & Conditions Modal
              } else {
                this.navController.navigateRoot("/"); // <-- Navigate to Dashboard
              }
            } else {
              this.navController.navigateRoot("/"); // <-- Navigate to Dashboard
            }
          } else {
            this._status = false;
            // this._message = "LOGIN.invalidcred";

            this.goToRegisterPage(loginviaflag, googleplusobj);
          }
        } else {
          this._status = false;
          this.goToRegisterPage(loginviaflag, googleplusobj);
        }
      },
      (err) => {
        // console.log("--> Error while api.getuserbyuserid(email)");
        this._status = false;
        this._message = "LOGIN.conerror";
        loading.dismiss();
      }
    );
  }

  goToRegisterPage(loginviaflag, res) {
    //console.log("--> Inside goToRegisterPage loginviaflag: ",loginviaflag, "    (res). res: " ,JSON.stringify(res));
    let navigationExtras: NavigationExtras;
    if (loginviaflag == "loginviamobile") {
      navigationExtras = {
        queryParams: {
          register_type: "google",
          googleplus_userId: res.userId,
          googleplus_displayName: res.displayName,
          googleplus_email: res.email,
          googleplus_givenName: res.givenName,
          googleplus_familyName: res.familyName,
          googleplus_imageUrl: res.hasOwnProperty("imageUrl")
            ? res.imageUrl
            : "/assets/img/default-user-profile-image.png",
        },
      };
    } else {
      navigationExtras = {
        queryParams: {
          register_type: "google",
          googleplus_userId: res.userId,
          googleplus_displayName: res.name,
          googleplus_email: res.email,
          googleplus_givenName: res.firstName,
          googleplus_familyName: res.lastName,
          googleplus_imageUrl: res.hasOwnProperty("photoUrl")
            ? res.photoUrl
            : "/assets/img/default-user-profile-image.png",
        },
      };
    }
    this.navController.navigateForward(["register"], navigationExtras);
  }

  signoutGoogle() {
    this.googlePlus
      .logout()
      .then((res) => {
        // console.log("Logout success: ", res);
      })
      .catch((err) => {
        // console.log("Logout Error", err);
      });
  }
}
