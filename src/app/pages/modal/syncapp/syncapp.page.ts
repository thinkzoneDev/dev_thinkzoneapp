import { Component, Input, OnInit } from "@angular/core";
import {
  IonIcon,
  NavController,
  ModalController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { RestApiService } from "./../../../rest-api.service";
import { environment } from "src/environments/environment.prod";

@Component({
  selector: "app-syncapp",
  templateUrl: "./syncapp.page.html",
  styleUrls: ["./syncapp.page.scss"],
})
export class SyncappPage implements OnInit {
  _userid: string = "";
  _password: string = "";
  _usertype: string = "";
  _package = environment.package;
  _baseUrl = environment.baseUrl;
  _serverip: string = "";
  toolbarshadow = true;
  count: number = 1;
  count_str: string = "";
  total_count: string = "3";

  student_list: any = [];
  modules_list: any = [];
  submodules_list: any = [];

  constructor(
    private navController: NavController,
    private modalController: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public api: RestApiService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._password = localStorage.getItem("_password");
    this._usertype = localStorage.getItem("_usertype");

    // Extract IP from baseurl
    let regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
    let fullurl = this._baseUrl;
    let ip = fullurl.match(regexp);
    this._serverip = ip ? ip[0] : "";
    // console.log("### Server IP: " + this._serverip);
  }

  ngOnInit() {}

  async confirmation() {
    const alert = await this.alertController.create({
      header: "Sync",
      subHeader: "" + this._baseUrl,
      message: "",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            // add cancel button click event here
          },
        },
        {
          text: "Ok",
          handler: () => {
            // add ok button click event here
          },
        },
      ],
    });
    await alert.present();
  }

  async fetch_offline_data() {
    try {
      // get app version
      await this.api.getappversion(this._package).subscribe(
        (res) => {
          this.count_str = this.count + "/ " + this.total_count;
          this.count++;
        },
        (err) => {
          console.log(err);
        }
      );

      // get user by userid
      let auth_obj = {
        emailid: this._userid,
        password: this._password,
        usertype: this._usertype,
      };
      await this.api.authenticateuser(auth_obj).subscribe(
        (res) => {
          this.count_str = this.count + "/ " + this.total_count;
          this.count++;
        },
        (err) => {
          console.log(err);
        }
      );

      // get user by userid
      await this.api.getuserbyuserid(this._userid).subscribe(
        (res) => {
          this.count_str = this.count + "/ " + this.total_count;
          this.count++;
        },
        (err) => {
          console.log(err);
        }
      );

      // get all training modules
      await this.api.getalltrainingmodules().subscribe(
        (res) => {
          this.modules_list = res;
          this.count_str = this.count + "/ " + this.total_count;
          this.count++;
        },
        (err) => {
          console.log(err);
        }
      );

      // get all training submodules
      this.modules_list.forEach(async (module) => {
        await this.api.getalltrainingsubmodules(module._id).subscribe(
          (res) => {
            let obj = {
              module: module,
              submodule: res,
            };
            this.submodules_list.push(obj);
            this.count_str = this.count + "/ " + this.total_count;
            this.count++;
          },
          (err) => {
            console.log(err);
          }
        );
      });

      // get all training contents & get tch training details
      this.submodules_list.forEach(async (submodule_list) => {
        let module = submodule_list.module;
        let submodules = submodule_list.submodule;
        submodules.forEach(async (submodule) => {
          // console.log("submodule", submodule);
          await this.api
            .getalltrainingcontents(module._id, submodule._id)
            .subscribe(
              (res) => {
                this.count_str = this.count + "/ " + this.total_count;
                this.count++;
              },
              (err) => {
                console.log(err);
              }
            );

          // await this.api.gettchtrainingdetails(this._usertype,module._id, submodule._id).subscribe(res => {
          //   this.count_str = this.count+'/ '+this.total_count;this.count++;
          // }, err => {console.log(err);});
        });
      });

      // get all students by teacher
      const studentcategory = "app";
      await this.api
        .getallstudentsbystudentcategory(this._userid, studentcategory)
        .subscribe(
          (res) => {
            this.student_list = res;
            this.count_str = this.count + "/ " + this.total_count;
            this.count++;
          },
          (err) => {
            console.log(err);
          }
        );

      // get all students by teacherid
      await this.api.getallstudentsbyteacherid(this._userid).subscribe(
        (res) => {
          this.student_list = res;
          this.count_str = this.count + "/ " + this.total_count;
          this.count++;
        },
        (err) => {
          console.log(err);
        }
      );

      // get attendance of teacher by date
      await this.api
        .getattendanceofteacherbydate(this._userid, new Date())
        .subscribe(
          (res) => {
            this.count_str = this.count + "/ " + this.total_count;
            this.count++;
          },
          (err) => {
            console.log(err);
          }
        );

      // get last 7 days attendance
      await this.api.getlast7daysattendance(this._userid, new Date()).subscribe(
        (res) => {
          this.count_str = this.count + "/ " + this.total_count;
          this.count++;
        },
        (err) => {
          console.log(err);
        }
      );

      // get messages by userid
      await this.api.getmessagesbyuserid(this._userid).subscribe(
        (res) => {
          this.count_str = this.count + "/ " + this.total_count;
          this.count++;
        },
        (err) => {
          console.log(err);
        }
      );

      // get tch get all paymentinfo
      await this.api.getallpaymentinfo().subscribe(
        (res) => {
          this.count_str = this.count + "/ " + this.total_count;
          this.count++;
        },
        (err) => {
          console.log(err);
        }
      );

      // get master activities
      await this.api
        .getmasteractivities("en", "pge", "odia", "1", "1")
        .subscribe(
          (res) => {
            this.count_str = this.count + "/ " + this.total_count;
            this.count++;
          },
          (err) => {
            console.log(err);
          }
        );

      // get master activities
      await this.api
        .getmasteractivitiydetails("en", "pge", "odia", "1", "1", "1")
        .subscribe(
          (res) => {
            this.count_str = this.count + "/ " + this.total_count;
            this.count++;
          },
          (err) => {
            console.log(err);
          }
        );

      // get tch activity by user
      await this.api
        .gettchactivitybyuser(this._userid, "pge", "odia", "1", "1")
        .subscribe(
          (res) => {
            this.count_str = this.count + "/ " + this.total_count;
            this.count++;
          },
          (err) => {
            console.log(err);
          }
        );

      // get tch activitiy details
      await this.api
        .gettchactivitiydetails(this._userid, "pge", "odia", "1", "1", "1")
        .subscribe(
          (res) => {
            this.count_str = this.count + "/ " + this.total_count;
            this.count++;
          },
          (err) => {
            console.log(err);
          }
        );

      // get tch get all assessment
      await this.api.getallassessment().subscribe(
        (res) => {
          this.count_str = this.count + "/ " + this.total_count;
          this.count++;
        },
        (err) => {
          console.log(err);
        }
      );

      // get tch assessment
      await this.api
        .gettchassessment("en", "pge", "1", "month1", "odia")
        .subscribe(
          (res) => {
            this.count_str = this.count + "/ " + this.total_count;
            this.count++;
          },
          (err) => {
            console.log(err);
          }
        );

      // get tch assessment test_all
      await this.api
        .gettchassessmenttest_all(this._userid, "pge", "1", "month1", "odia")
        .subscribe(
          (res) => {
            this.count_str = this.count + "/ " + this.total_count;
            this.count++;
          },
          (err) => {
            console.log(err);
          }
        );

      // get baseline test question set
      let baseline_obj = {
        preferedlanguage: "en",
        program: "ece",
        subject: "na",
        level: "2",
      };
      await this.api.getbaselinetestquestionset(baseline_obj).subscribe(
        (res) => {
          this.count_str = this.count + "/ " + this.total_count;
          this.count++;
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (err) {
      console.log("###Error: " + JSON.stringify(err));
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
