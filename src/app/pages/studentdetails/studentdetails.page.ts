import {
  Component,
  Directive,
  Input,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AlertController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import { RestApiService } from "./../../rest-api.service";
import Chart from "chart.js";
import { flatten } from "@angular/core/src/render3/util";
import { ServerDownService } from "src/app/services/server-down.service";
@Component({
  selector: "app-studentdetails",
  templateUrl: "./studentdetails.page.html",
  styleUrls: ["./studentdetails.page.scss"],
})
export class StudentdetailsPage {
  barChart: any;
  @ViewChild("barCanvas") barCanvas;

  chart: any;
  data: any;
  labels: any = [];
  chartData: any = [];
  keywordsInput: any;
  toolbarshadow: boolean;
  baseline_done: boolean;
  baseline_mark: number = 0;
  end_mark: number = 0;
  yAxisArray = [];
  array_chart = [];
  show_hide_div: any;
  max_question: number = 0;
  baseline_question: number = 0;
  endline_question: number = 0;
  endline_submit: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public api: RestApiService,
    private loadingController: LoadingController,
    public alertController: AlertController,
    public navController: NavController,
    private serverDownMsg: ServerDownService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.studentObj;
        const { userid, studentid, program, studentcategory } = this.data;
        if (studentcategory === "app") {
          if (this.data.mainbaselinestatus == "complete") {
            this.getstudentprogressdata(userid, studentid, program);
            this.show_hide_div = false;
          } else {
            this.show_hide_div = true;
            this.showAlert(
              "Status",
              "",
              "Please Submit the Baseline for the student"
            );
          }
        } else {
          if (this.data.mainbaselinestatus == "complete") {
            this.getHblStudentProgressData(userid, studentid);
            this.show_hide_div = false;
          } else {
            this.show_hide_div = true;
            this.showAlert(
              "Status",
              "",
              "Please Submit the Baseline for the student"
            );
          }
        }
      }
    });
  }

  async getstudentprogressdata(userid, studentid, program) {
    const loading = await this.loadingController.create({ duration: 3000 });
    await loading.present();
    await this.api.getstudentprogressdata(userid, studentid, program).subscribe(
      (res) => {
        console.log(res);
        res[0].baselinedata.forEach((element) => {
          const subjectarray = element.assessmenttest;
          subjectarray.forEach((question) => {
            if (question) {
              this.baseline_question += 1;
            }

            if (question.answer === "yes") {
              this.baseline_mark += 1;
            }
          });
        });

        res[0].endlinedata.forEach((element) => {
          const subjectarray = element.assessmenttest;
          subjectarray.forEach((question) => {
            if (question) {
              this.endline_question += 1;
            }

            if (question.answer === "yes") {
              this.end_mark += 1;
            }
          });
        });
        this.pushData();
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  async getHblStudentProgressData(userid, studentid) {
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api.getHblStudentProgressData(userid, studentid).subscribe(
      (res) => {
        console.log(res);
        res[0].baselinedata.forEach((element) => {
          const subjectarray = element.assessmenttest;
          subjectarray.forEach((question) => {
            if (question) {
              this.baseline_question += 1;
            }

            if (question.answer === "yes") {
              this.baseline_mark += 1;
            }
          });
        });

        res[0].endlinedata.forEach((element) => {
          const subjectarray = element.assessmenttest;
          subjectarray.forEach((question) => {
            if (question) {
              this.endline_question += 1;
            }

            if (question.answer === "yes") {
              this.end_mark += 1;
            }
          });
        });
        this.pushData();
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
        this.serverDownMsg.presentToast();
      }
    );
  }

  pushData() {
    this.array_chart.push(this.baseline_mark);
    this.array_chart.push(this.end_mark);
    if (this.baseline_question >= this.endline_question) {
      this.max_question = this.baseline_question;
    } else {
      this.max_question = this.endline_question;
    }
    this.barChartMethod();
  }

  public barChartMethod() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Baseline", "Endline"],
        datasets: [
          {
            label: "Activity Know",
            data: this.array_chart || [],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(255,99,132,1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 2,
          },
        ],
      },

      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Category Baseline & Endline",
              },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                min: 0,
                max: this.max_question,
                stepSize: 1,
              },
              scaleLabel: {
                display: true,
                labelString: "Secured mark out of total mark",
              },
            },
          ],
        },
      },
    });
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
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
          text: "Ok",
          handler: () => {
            this.navController.navigateBack("studentexplor");
          },
        },
      ],
    });
    await alert.present();
  }
  async ShowConfirm(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ["Ok"],
    });
    await alert.present();
  }
}
