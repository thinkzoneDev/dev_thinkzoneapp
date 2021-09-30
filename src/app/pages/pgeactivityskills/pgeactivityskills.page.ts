import { Component, NgZone } from "@angular/core";
import {
  NavController,
  AlertController,
  ToastController,
  LoadingController,
} from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { RestApiService } from "./../../rest-api.service";

@Component({
  selector: "app-pgeactivityskills",
  templateUrl: "./pgeactivityskills.page.html",
  styleUrls: ["./pgeactivityskills.page.scss"],
})
export class PgeactivityskillsPage {
  // default variables
  preferedlanguage: string = "";
  userid: string = "";
  program: string = "";
  subject: string = "";
  level: string = "";
  month: string = "";
  skill: string = "";

  skill_list: any = [];

  constructor(
    public navController: NavController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params && params.paramiters) {
        const qryParams = JSON.parse(params.paramiters);
        // console.log("--> qryParams: " + JSON.stringify(qryParams));
        this.preferedlanguage = qryParams.preferedlanguage;
        this.userid = qryParams.userid;
        this.program = qryParams.program;
        this.subject = qryParams.subject;
        this.level = qryParams.level;
        this.month = qryParams.month;
        // console.log(
        //   "--> preferedlanguage: " +
        //     this.preferedlanguage +
        //     "    userid: " +
        //     this.userid +
        //     "    program: " +
        //     this.program +
        //     "    subject: " +
        //     this.subject +
        //     "    level: " +
        //     this.level +
        //     "    month: " +
        //     this.month
        // );
        this.getskills(
          this.preferedlanguage,
          this.userid,
          this.program,
          this.subject,
          this.level
        );
      }
    });
  }

  async getskills(preferedlanguage, userid, program, subject, level) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api
      .getpgeactivityskill(preferedlanguage, program, subject, level)
      .subscribe(
        (res) => {
          // console.log("--> res: " + JSON.stringify(res));
          this.skill_list = res;
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
        }
      );
  }

  async skill_on_click(index, skill) {
    this.skill = skill;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify({
          preferedlanguage: this.preferedlanguage,
          userid: this.userid,
          program: this.program,
          subject: this.subject,
          level: this.level,
          month: this.month,
          skill: index,
        }),
      },
    };
    this.router.navigate(["pgeactivitycontents"], navigationExtras);
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
    } else {
    }
  }
}
