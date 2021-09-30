import {
  Component,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  NavController,
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
  Events,
} from "@ionic/angular";
import { GallaryModelPage } from "../../gallary-model/gallary-model.page";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { RestApiService } from "./../../rest-api.service";
// to access sd card
import { Diagnostic } from "@ionic-native/diagnostic/ngx";

import { DataService } from "src/app/services/data.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataObject } from "src/app/services/DataObject";
import { TranslateService } from "@ngx-translate/core";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-ecactivity2",
  templateUrl: "./ecactivity2.page.html",
  styleUrls: ["./ecactivity2.page.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class Ecactivity2Page {
  qryParams: any;
  activityobj: any = {};
  content: SafeHtml = "";
  image: any = [];
  worksheet = "";
  video = "";

  sdcard_path = "";
  sdcard_filepath = "";
  doc_filepath_full = "";
  vid_filepath_full = "";

  selected_program = "";
  selected_subject = "";
  selected_month = "";
  selected_week = "";
  selected_activity = "";

  isVisited_content = false;
  isVisited_video = false;
  isVisited_worksheet = false;
  isEnabled_completeActivityButton = false;
  isActivity_alreadySaved = false;

  _userid: string;
  _username: string;
  toolbarshadow = true;
  full_video_path_list: DataObject[] = [];
  full_sheet_path_list: DataObject[] = [];

  preferedlanguage: string = localStorage.getItem("_language");

  displayfab = false;
  btnliked = false;

  constructor(
    private navController: NavController,
    private alertController: AlertController,
    private modalController: ModalController,
    private api: RestApiService,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private router: Router,
    private diagnostic: Diagnostic,
    private navCtrl: NavController,
    private dataService: DataService,
    private domSanitizer: DomSanitizer,
    private translateService: TranslateService,
    private toastController: ToastController,
    public events: Events,
    private serverDownMsg: ServerDownService
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");

    // query params
    this.route.queryParams.subscribe((params) => {
      if (params && params.paramiters) {
        this.qryParams = JSON.parse(params.paramiters);
        this.selected_program = this.qryParams.program;
        this.selected_subject = this.qryParams.subject;
        this.selected_month = this.qryParams.month;
        this.selected_week = this.qryParams.week;
        this.selected_activity = this.qryParams.activity;
        this.getmasteractivitiydetails(
          this.preferedlanguage,
          this.selected_program,
          this.selected_subject,
          this.selected_month,
          this.selected_week,
          this.selected_activity
        );
      }

      this.show_month_week_labels(
        this.selected_program,
        this.selected_subject,
        this.selected_month,
        this.selected_week
      );
    });

    this.Enable_CompleteActivityButton();
    this.getTchActivity();

    var _self = this;
    setTimeout(() => {
      _self.displayfabCall();
    }, 1000);
  }

  async updateactivityfab() {
    var isliked = !this.btnliked;
    var activity_name = (this.activityobj || {})._id || "";
    const body = {
      userid: this._userid,
      is_like: isliked,
      activity_name: activity_name,
      feedback: "",
    };
    await this.api.savetchfeedback(body).subscribe(
      async (res) => {
        this.displayfabCall();

        const toast = await this.toastController.create({
          showCloseButton: true,
          //cssClass: 'bg-profile',
          message: "Your response has been recorded!",
          duration: 3000,
          position: "bottom",
        });

        toast.present();
      },
      (err) => {
        this.displayfabCall();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async displayfabCall() {
    const body = {
      userid: this._userid,
    };
    this.api.gettchfeedback(body).subscribe(
      (res) => {
        this.displayfab = true;
        //this.btnliked = true;

        var activity_name = (this.activityobj || {})._id || "";
        var value = res;
        var act_res = (value || []).find(
          (a) => a.activity_name == activity_name
        );
        if (act_res) this.btnliked = act_res.is_like || false;
      },
      (err) => {
        this.serverDownMsg.presentToast();
      }
    );

    // var _seld = this;
    // setInterval(() => {
    //   _seld.btnliked = !_seld.btnliked;
    // }, 300);
  }

  // show month week labels
  selected_month_label: string = "";
  selected_week_label: string = "";
  show_month_week_labels(
    selected_program,
    selected_subject,
    selected_month,
    selected_week
  ) {
    if (selected_program == "ece") {
      selected_subject = "";
      // labels for month
      if (selected_month == "1") {
        this.selected_month_label =
          this.translateService.get("ECEACTIVITY.month1")["value"];
      } else if (selected_month == "2") {
        this.selected_month_label =
          this.translateService.get("ECEACTIVITY.month2")["value"];
      } else if (selected_month == "3") {
        this.selected_month =
          this.translateService.get("ECEACTIVITY.month3")["value"];
      } else if (this.selected_month_label == "4") {
        this.selected_month_label =
          this.translateService.get("ECEACTIVITY.month4")["value"];
      } else if (selected_month == "5") {
        this.selected_month_label =
          this.translateService.get("ECEACTIVITY.month5")["value"];
      } else if (selected_month == "6") {
        this.selected_month_label =
          this.translateService.get("ECEACTIVITY.month6")["value"];
      } else if (selected_month == "7") {
        this.selected_month_label =
          this.translateService.get("ECEACTIVITY.month7")["value"];
      } else if (selected_month == "8") {
        this.selected_month_label =
          this.translateService.get("ECEACTIVITY.month8")["value"];
      } else if (selected_month == "9") {
        this.selected_month_label =
          this.translateService.get("ECEACTIVITY.month9")["value"];
      } else if (selected_month == "10") {
        this.selected_month_label = this.translateService.get(
          "ECEACTIVITY.month10"
        )["value"];
      }
      // labels for week
      if (selected_week == "1") {
        this.selected_week_label =
          this.translateService.get("ECEACTIVITY.week1")["value"];
      } else if (selected_week == "2") {
        this.selected_week_label =
          this.translateService.get("ECEACTIVITY.week2")["value"];
      } else if (selected_week == "3") {
        this.selected_week_label =
          this.translateService.get("ECEACTIVITY.week3")["value"];
      } else if (selected_week == "4") {
        this.selected_week_label =
          this.translateService.get("ECEACTIVITY.week4")["value"];
      }
    } else if (selected_program == "pge") {
      // labels for month
      if (selected_month == "1") {
        this.selected_month_label = this.translateService.get(
          "PGEACTIVITY.skill1_4"
        )["value"];
      } else if (selected_month == "2") {
        this.selected_month_label = this.translateService.get(
          "PGEACTIVITY.skill5_8"
        )["value"];
      } else if (selected_month == "3") {
        this.selected_month_label = this.translateService.get(
          "PGEACTIVITY.skill9_12"
        )["value"];
      } else if (selected_month == "4") {
        this.selected_month_label = this.translateService.get(
          "PGEACTIVITY.skill13_16"
        )["value"];
      } else if (selected_month == "5") {
        this.selected_month_label = this.translateService.get(
          "PGEACTIVITY.skill17_20"
        )["value"];
      }

      // labels for week
      if (selected_week == "1") {
        this.selected_week_label =
          this.translateService.get("PGEACTIVITY.1")["value"];
      } else if (selected_week == "2") {
        this.selected_week_label =
          this.translateService.get("PGEACTIVITY.2")["value"];
      } else if (selected_week == "3") {
        this.selected_week_label =
          this.translateService.get("PGEACTIVITY.3")["value"];
      } else if (selected_week == "4") {
        this.selected_week_label =
          this.translateService.get("PGEACTIVITY.4")["value"];
      } else if (selected_week == "5") {
        this.selected_week_label =
          this.translateService.get("PGEACTIVITY.5")["value"];
      }
    }
  }

  // getmasteractivitiydetails
  async getmasteractivitiydetails(
    preferedlanguage,
    program,
    subject,
    month,
    week,
    activity
  ) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .getmasteractivitiydetails(
        preferedlanguage,
        program,
        subject,
        month,
        week,
        activity
      )
      .subscribe(
        (res) => {
          if (res.length > 0) {
            this.activityobj = res[0];
            //this.content = this.domSanitizer.bypassSecurityTrustHtml(this.activityobj.content);
            this.image = this.activityobj.image;
            this.worksheet = this.activityobj.worksheet;
            this.video = this.activityobj.video;
            this.fillVideoPathNames(this.activityobj.video);
            this.fillSheetPathNames(this.activityobj.worksheet);

            this.content = this.domSanitizer.bypassSecurityTrustHtml(
              this.activityobj.content
            );
            this.isVisited_content = true;
          }
          loading.dismiss();

          this.Enable_CompleteActivityButton();

          this.displayfabCall();
        },
        (err) => {
          loading.dismiss();
          this.isEnabled_completeActivityButton = false;
          this.serverDownMsg.presentToast();
        }
      );
  }
  gallaryModel(img) {
    this.modalController
      .create({
        component: GallaryModelPage,
        componentProps: {
          img: img,
        },
      })
      .then((model) => model.present());
  }
  fillVideoPathNames(names: string[]) {
    this.full_video_path_list = [];
    for (let i = 1; i <= names.length; i++) {
      this.full_video_path_list.push({
        path: names[i - 1],
        played: false,
      });
    }
    this.dataService.setDocumentData(this.full_video_path_list);
  }

  fillSheetPathNames(names: string[]) {
    let p;
    if (this.selected_program.toUpperCase() === "ECE") {
      p =
        this.sdcard_filepath +
        this.sdcard_filepath +
        "/THINKZONE/ECE/WORKSHEET";
    } else {
      p =
        this.sdcard_filepath +
        "/THINKZONE/PGE/" +
        this.selected_subject.toLocaleUpperCase() +
        "/WORKSHEET";
    }

    this.full_sheet_path_list = [];
    for (let i = 1; i <= names.length; i++) {
      this.full_sheet_path_list.push({
        path: names[i - 1], //p,
        file_name:
          "M" +
          this.selected_month +
          "_W" +
          this.selected_week +
          "_A" +
          this.selected_activity +
          ".pdf",
        played: false,
      });
    }
  }
  // -------------------------------------------

  // play video button click
  async play_video() {
    this.dataService.setDocumentData(this.full_video_path_list);
    this.dataService.setData("type", "video");
    this.dataService.setData("page_title", "Videos");
    this.navCtrl.navigateForward("/file-display");
  }

  // open document button click
  async open_document() {
    this.dataService.setDocumentData(this.full_sheet_path_list);
    this.dataService.setData("type", "document");
    this.dataService.setData("page_title", "Worksheets");
    this.navController.navigateForward("/file-display");
  }

  async complete_activity() {
    if (this.isActivity_alreadySaved) {
      this.showAlert("Info", "", "Activity already completed");
    } else {
      const body = {
        userid: this._userid,
        username: this._username,
        program: this.selected_program,
        subject: this.selected_subject,
        month: this.selected_month,
        week: this.selected_week,
        activity: this.selected_activity,
        content: "",
        content_status: true,
        worksheet: "",
        worksheet_status: true,
        video: "",
        video_status: true,
      };
      const loading = await this.loadingController.create({ duration: 5000 });
      await loading.present();
      await this.api.savetchactivity(body).subscribe(
        (res) => {
          if (res.status) {
            this.showAlert("Activity", "", " Activity completed");
          }
          this.events.publish("activity:completed", body);
          // this.showAlert('Activity', '', 'Activity save ' + JSON.stringify(res.status));
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
    }
  }

  // for checking the specific activity is already saved by this user or not
  async getTchActivity() {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .gettchactivitiydetails(
        this._userid,
        this.selected_program,
        this.selected_subject,
        this.selected_month,
        this.selected_week,
        this.selected_activity
      )
      .subscribe(
        (res) => {
          if (res.length > 0) {
            this.isActivity_alreadySaved = true;
          } else {
            this.isActivity_alreadySaved = false;
          }
          this.Enable_CompleteActivityButton();
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
  }

  Enable_CompleteActivityButton() {
    this.isEnabled_completeActivityButton = true;

    /*
    this.full_sheet_path_list.forEach(element => {
      this.isEnabled_completeActivityButton = this.isEnabled_completeActivityButton && element.played;
    });
    */
    this.full_video_path_list.forEach((element) => {
      this.isEnabled_completeActivityButton =
        this.isEnabled_completeActivityButton && element.played;
    });
    if (this.isEnabled_completeActivityButton) {
    } else {
    }
  }

  // alert box
  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.close_modal();
          },
        },
      ],
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

  ionViewDidEnter() {
    this.Enable_CompleteActivityButton();
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
  async close_modal() {
    const paramiters = {
      month: this.selected_month,
      week: this.selected_week,
    };
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify(paramiters),
      },
    };
    if (this.selected_subject == "math") {
      this.router.navigate(["pgactivity"], navigationExtras);
    }
    if (this.selected_subject == "english") {
      this.router.navigate(["pgactivityeng"], navigationExtras);
    }
    if (this.selected_subject == "odia") {
      this.router.navigate(["pgactivityodia"], navigationExtras);
    }
    if (this.selected_subject == "na") {
      this.router.navigate(["ecactivity"], navigationExtras);
    }
  }
}

/*
// FILE TYPES
    if(file_ext == 'jpg' || file_ext == 'jpeg')       file_type = 'image/jpeg';
    else if(file_ext == 'png' || file_ext == 'apng')  file_type = 'image/png';
    else if(file_ext == 'gif')                        file_type = 'image/gif';
    else if(file_ext == 'bmp')                        file_type = 'image/bmp';
    else if(file_ext == 'svg' || file_ext == 'svgz')  file_type = 'image/svg+xml';
    else if(file_ext == 'tif' || file_ext == 'tiff')  file_type = 'image/tiff';
    else if(file_ext == 'pdf')                        file_type = 'application/pdf';
    else if(file_ext == 'txt')                        file_type = 'text/plain';
    else if(file_ext == 'csv')                        file_type = 'text/csv';
    else if(file_ext == 'htm' || file_ext == 'html')  file_type = 'text/html';
    else if(file_ext == 'doc')                        file_type = 'application/msword';
    else if(file_ext == 'docx')                       file_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if(file_ext == 'ppt')                        file_type = 'application/vnd.ms-powerpoint';
    else if(file_ext == 'pptx')                       file_type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    else if(file_ext == 'xls')                        file_type = 'application/vnd.ms-excel';
    else if(file_ext == 'xlsx')                       file_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    else if(file_ext == 'odp')                        file_type = 'application/vnd.oasis.opendocument.presentation';
    else if(file_ext == 'ods')                        file_type = 'application/vnd.oasis.opendocument.spreadsheet';
    else if(file_ext == 'odt')                        file_type = 'application/vnd.oasis.opendocument.text';
*/
