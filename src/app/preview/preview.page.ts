import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { TranslateService } from "@ngx-translate/core";
import {
  AlertController,
  ModalController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import { RestApiService } from "../rest-api.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ServerDownService } from "../services/server-down.service";
@Component({
  selector: "app-preview",
  templateUrl: "./preview.page.html",
  styleUrls: ["./preview.page.scss"],
})
export class PreviewPage implements OnInit {
  userid: string;
  username: string;
  language: string;
  moduleid: any;
  modulename: any;
  submoduleid: any;
  submodulename: any;
  topicid: any;
  topicname: any;
  userquizdata: any = [];
  total_mark: number = 0;
  secured_mark: number = 0;
  toolbarshadow: boolean;

  constructor(
    public navController: NavController,
    public dataServ: DataService,
    public modalCtrl: ModalController,
    private translateService: TranslateService,
    public api: RestApiService,
    private loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private serverDownMsg: ServerDownService
  ) {
    this.userid = localStorage.getItem("_userid");
    this.username = localStorage.getItem("_username");
    this.language = localStorage.getItem("_language");
    this.route.queryParams.subscribe((params) => {
      console.log("-->Params: ", params);

      if (
        params.parameters == undefined ||
        params.parameters.quiz.length == 0
      ) {
      } else {
        this.moduleid = params.parameters.moduleid;
        this.modulename = params.parameters.modulename;
        this.submodulename = params.parameters.submodulename;
        this.submoduleid = params.parameters.submoduleid;
        this.topicid = params.parameters.topicid;
        this.topicname = params.parameters.topicname;
      }
    });
  }

  ngOnInit() {
    this.getuserdata(
      this.userid,
      this.moduleid,
      this.submoduleid,
      this.topicid
    );
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }

  async getuserdata(uid, mid, sid, tid) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getppttopicdetails(uid, mid, sid, tid).subscribe(
      (res) => {
        console.log("-->Res: ", typeof res, res);
        if (Object.keys(res).length > 0) {
          this.userquizdata = res[0].quiz ? res[0].quiz : [];
          this.total_mark = res[0].totalmark;
          this.secured_mark = res[0].score;
        } else {
          this.userquizdata = [];
        }
        console.log("-->Userdata: ", this.userquizdata);
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async ok_btnclick() {
    this.navController.navigateBack("/contentdetails");
  }

  async showConfirm(secured_mark, total_mark, timeTaken) {
    const alert = await this.alertController.create({
      header: "Success",
      subHeader: "",
      message:
        "Secured Mark:" +
        secured_mark +
        "</br>" +
        "Total Mark:" +
        total_mark +
        "</br>" +
        "Time Duration:" +
        timeTaken,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.navController.navigateRoot("trainingcontent");
          },
        },
      ],
    });
    await alert.present();
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
}
