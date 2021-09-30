import { Component, NgZone } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { RestApiService } from "./../../rest-api.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
// import { IconpopoverComponent } from '../';

@Component({
  selector: "app-topiccontent",
  templateUrl: "./topiccontent.page.html",
  styleUrls: ["./topiccontent.page.scss"],
})
export class TopiccontentPage {
  topicdetails: any;
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  quizstatus: boolean = false;
  moduleid: any;
  submoduleid: any;
  contentstatus: boolean = false;
  topicid: any;
  topicname: any;
  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private zone: NgZone,
    // private sanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private camera: Camera,
    private geolocation: Geolocation,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = "";
    this._centername = "";

    this.route.queryParams.subscribe((params) => {
      if (params.parameters == "" || params.parameters == undefined) {
        this.contentstatus = false;
        this.quizstatus = false;
      } else {
        this.moduleid = params.parameters[0].moduleid;
        this.submoduleid = params.parameters[0].submoduleid;
        this.topicid = params.parameters[0].topicid;
        this.topicdetails = params.parameters[0];
        console.log("this.topicdetails", this.topicdetails);
        this.getTchTraaining_status(
          this._userid,
          this.moduleid,
          this.submoduleid,
          this.topicid
        );
      }
    });
    // this.quizstatus = true;
  }
  async getTchTraaining_status(uid, mid, sid, tid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.gettopicdetails(uid, mid, sid, tid).subscribe(
      (res) => {
        console.log("res", res);
        if (res.length > 0) {
          if (res[0].content_status == true && res[0].quiz_status == true) {
            this.quizstatus = true;
            this.contentstatus = true;
          } else if (
            res[0].content_status == true &&
            res[0].quiz_status == false
          ) {
            this.quizstatus = false;
            this.contentstatus = true;
          }
          // else{
          //   this.quizstatus = true;
          //   this.contentstatus = false;
          // }
        } else {
          this.quizstatus = true;
          this.contentstatus = false;
        }

        loading.dismiss();
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }
  async goToContentDetails() {
    console.log("this.topicdetails", this.topicdetails);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        parameters: this.topicdetails,
      },
    };
    this.navController.navigateForward("/contentdetails", navigationExtras);
  }
  goToQuizDetails() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        parameters: this.topicdetails,
      },
    };
    this.navController.navigateForward("/quiz", navigationExtras);
  }
}
