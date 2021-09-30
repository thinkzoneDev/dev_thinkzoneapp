import {
  Component,
  OnInit,
  ViewChild,
  Directive,
  Input,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  AlertController,
  LoadingController,
  NavController,
} from "@ionic/angular";
import { RestApiService } from "./../../rest-api.service";
import Chart from "chart.js";

@Component({
  selector: "app-indivisual-user-performance",
  templateUrl: "./indivisual-user-performance.page.html",
  styleUrls: ["./indivisual-user-performance.page.scss"],
})
export class IndivisualUserPerformancePage implements OnInit {
  barChart: any;
  lineChart: any;
  @ViewChild("baselienEndline") baselienEndline;
  @ViewChild("training") training;
  @ViewChild("timeSpent") timeSpent;
  toolbarshadow = true;
  current_year: any;
  baselineEndlineMark = [];
  timeSpentInApp = [];
  totalMonthlyScore = [];
  securedMonthlyScore = [];
  language: string;
  userid: string;
  baselineEndlineScore: number = 0;
  baselineEndlineTotalMark: number = 0;
  max_question: number = 0;
  timeSpentMonth1: number = 0;
  timeSpentMonth2: number = 0;
  timeSpentMonth3: number = 0;
  timeSpentMonth4: number = 0;
  timeSpentMonth5: number = 0;
  timeSpentMonth6: number = 0;
  timeSpentMonth7: number = 0;
  timeSpentMonth8: number = 0;
  timeSpentMonth9: number = 0;
  timeSpentMonth10: number = 0;
  timeSpentMonth11: number = 0;
  timeSpentMonth12: number = 0;
  mostTimeSpent: number = 0;
  mtSecuredMarkMonth1: number = 0;
  mtSecuredMarkMonth2: number = 0;
  mtSecuredMarkMonth3: number = 0;
  mtSecuredMarkMonth4: number = 0;
  mtSecuredMarkMonth5: number = 0;
  mtSecuredMarkMonth6: number = 0;
  mtSecuredMarkMonth7: number = 0;
  mtSecuredMarkMonth8: number = 0;
  mtSecuredMarkMonth9: number = 0;
  mtSecuredMarkMonth10: number = 0;
  mtSecuredMarkMonth11: number = 0;
  mtSecuredMarkMonth12: number = 0;
  mtTotalMarkMonth1: number = 0;
  mtTotalMarkMonth2: number = 0;
  mtTotalMarkMonth3: number = 0;
  mtTotalMarkMonth4: number = 0;
  mtTotalMarkMonth5: number = 0;
  mtTotalMarkMonth6: number = 0;
  mtTotalMarkMonth7: number = 0;
  mtTotalMarkMonth8: number = 0;
  mtTotalMarkMonth9: number = 0;
  mtTotalMarkMonth10: number = 0;
  mtTotalMarkMonth11: number = 0;
  mtTotalMarkMonth12: number = 0;
  maxMonthlyQuestion: number = 0;
  hideBaselineDive: boolean;
  hideTrainingDiv: boolean;
  hideTimeSpentDiv: boolean;
  errMessage: boolean;
  averagescore: number = 0;

  constructor(
    private router: Router,
    public api: RestApiService,
    private loadingController: LoadingController,
    public alertController: AlertController,
    public navController: NavController
  ) {
    let current_date = new Date();
    this.current_year = current_date.getFullYear();
    this.language = localStorage.getItem("_language");
    this.userid = localStorage.getItem("_userid");
    this.getUserProgressData(this.userid, this.language, this.current_year);
    this.getLeaderBoardData(this.userid, this.language);
    this.errMessage = false;
    this.hideBaselineDive = false;
    this.hideTrainingDiv = false;
    this.hideTimeSpentDiv = false;
  }

  ngOnInit() {}

  async getLeaderBoardData(userid, language) {
    let current_date = new Date();
    let current_month = current_date.getMonth() + 1;
    let current_year = current_date.getFullYear();
    const loading = await this.loadingController.create({ duration: 5000 });
    await loading.present();
    await this.api
      .getLeaderBoardData(userid, language, current_month, current_year)
      .subscribe(
        (res) => {
          if (
            res[0] == undefined ||
            res[0] == null ||
            Object.keys(res[0]).length <= 0
          ) {
            this.averagescore = 0;
          } else {
            this.averagescore = res[0].finalrank;
            console.log(this.averagescore);
          }
          loading.dismiss();
        },
        (err) => {
          loading.dismiss();
        }
      );
  }

  async getUserProgressData(userid, language, current_year) {
    const loading = await this.loadingController.create({
      spinner: "bubbles",
      duration: 5000,
    });
    await loading.present();
    await this.api
      .getUserProgressData(userid, language, current_year)
      .subscribe(
        (res) => {
          if (
            res[0] == undefined ||
            res[0] == null ||
            Object.keys(res[0]).length <= 0
          ) {
            this.showAlert(
              "Alert",
              "",
              "Please complete Baseline/Endline or complete some training modules"
            );
          } else {
            //Baseline & Endline Mark
            if (
              res[0].baselinedata[0] &&
              Object.keys(res[0].baselinedata[0]).length > 0
            ) {
              this.baselineEndlineScore =
                res[0].baselinedata[0].secured_baselineendline;
              this.baselineEndlineTotalMark =
                res[0].baselinedata[0].total_baselineendline;
              console.log(
                "Baseline-->",
                this.baselineEndlineScore,
                this.baselineEndlineTotalMark
              );
            } else {
              this.hideBaselineDive = true;
            }
            //Time Spent
            if (
              res[0].timespentdata &&
              Object.keys(res[0].timespentdata).length > 0
            ) {
              res[0].timespentdata.forEach((element) => {
                if (element._id === 1) {
                  this.timeSpentMonth1 = Math.floor(element.duration);
                } else if (element._id === 2) {
                  this.timeSpentMonth2 = Math.floor(element.duration);
                } else if (element._id === 3) {
                  this.timeSpentMonth3 = Math.floor(element.duration);
                } else if (element._id === 4) {
                  this.timeSpentMonth4 = Math.floor(element.duration);
                } else if (element._id === 5) {
                  this.timeSpentMonth5 = Math.floor(element.duration);
                } else if (element._id === 6) {
                  this.timeSpentMonth6 = Math.floor(element.duration);
                } else if (element._id === 7) {
                  this.timeSpentMonth7 = Math.floor(element.duration);
                } else if (element._id === 8) {
                  this.timeSpentMonth8 = Math.floor(element.duration);
                } else if (element._id === 9) {
                  this.timeSpentMonth9 = Math.floor(element.duration);
                } else if (element._id === 10) {
                  this.timeSpentMonth10 = Math.floor(element.duration);
                } else if (element._id === 11) {
                  this.timeSpentMonth11 = Math.floor(element.duration);
                } else {
                  this.timeSpentMonth12 = Math.floor(element.duration);
                }
              });
            } else {
              this.hideTimeSpentDiv = true;
            }
            //Monthly Trainng
            if (
              res[0].trainingdata &&
              Object.keys(res[0].trainingdata).length > 0
            ) {
              res[0].trainingdata.forEach((element) => {
                if (element._id === 1) {
                  this.mtSecuredMarkMonth1 = element.secured_monthly;
                  this.mtTotalMarkMonth1 = element.total_monthly;
                } else if (element._id === 2) {
                  this.mtSecuredMarkMonth2 = element.secured_monthly;
                  this.mtTotalMarkMonth2 = element.total_monthly;
                } else if (element._id === 3) {
                  this.mtSecuredMarkMonth3 = element.secured_monthly;
                  this.mtTotalMarkMonth3 = element.total_monthly;
                } else if (element._id === 4) {
                  this.mtSecuredMarkMonth4 = element.secured_monthly;
                  this.mtTotalMarkMonth4 = element.total_monthly;
                } else if (element._id === 5) {
                  this.mtSecuredMarkMonth5 = element.secured_monthly;
                  this.mtTotalMarkMonth5 = element.total_monthly;
                } else if (element._id === 6) {
                  this.mtSecuredMarkMonth6 = element.secured_monthly;
                  this.mtTotalMarkMonth6 = element.total_monthly;
                } else if (element._id === 7) {
                  this.mtSecuredMarkMonth7 = element.secured_monthly;
                  this.mtTotalMarkMonth7 = element.total_monthly;
                } else if (element._id === 8) {
                  this.mtSecuredMarkMonth8 = element.secured_monthly;
                  this.mtTotalMarkMonth8 = element.total_monthly;
                } else if (element._id === 9) {
                  this.mtSecuredMarkMonth9 = element.secured_monthly;
                  this.mtTotalMarkMonth9 = element.total_monthly;
                } else if (element._id === 10) {
                  this.mtSecuredMarkMonth10 = element.secured_monthly;
                  this.mtTotalMarkMonth10 = element.total_monthly;
                } else if (element._id === 11) {
                  this.mtSecuredMarkMonth11 = element.secured_monthly;
                  this.mtTotalMarkMonth11 = element.total_monthly;
                } else {
                  this.mtSecuredMarkMonth12 = element.secured_monthly;
                  this.mtTotalMarkMonth12 = element.total_monthly;
                }
              });
            } else {
              this.hideTrainingDiv = true;
            }
          }
          loading.dismiss();
          this.pushData();
          if (
            this.hideBaselineDive === true &&
            this.hideTrainingDiv === true &&
            this.hideTimeSpentDiv === true
          ) {
            this.showAlert(
              "Alert",
              "",
              "Please complete Baseline/Endline or complete some training modules"
            );
          }
        },
        (err) => {
          console.log("Error-->", err);
          loading.dismiss();
          this.showAlert("Alert", "", "Unable to fetch user data");
        }
      );
  }

  pushData() {
    this.baselineEndlineMark.push(this.baselineEndlineScore);
    this.timeSpentInApp.push(
      this.timeSpentMonth1,
      this.timeSpentMonth2,
      this.timeSpentMonth3,
      this.timeSpentMonth4,
      this.timeSpentMonth5,
      this.timeSpentMonth6,
      this.timeSpentMonth7,
      this.timeSpentMonth8,
      this.timeSpentMonth9,
      this.timeSpentMonth10,
      this.timeSpentMonth11,
      this.timeSpentMonth12
    );
    this.totalMonthlyScore.push(
      this.mtTotalMarkMonth1,
      this.mtTotalMarkMonth2,
      this.mtTotalMarkMonth3,
      this.mtTotalMarkMonth4,
      this.mtTotalMarkMonth5,
      this.mtTotalMarkMonth6,
      this.mtTotalMarkMonth7,
      this.mtTotalMarkMonth8,
      this.mtTotalMarkMonth9,
      this.mtTotalMarkMonth10,
      this.mtTotalMarkMonth11,
      this.mtTotalMarkMonth12
    );
    this.securedMonthlyScore.push(
      this.mtSecuredMarkMonth1,
      this.mtSecuredMarkMonth2,
      this.mtSecuredMarkMonth3,
      this.mtSecuredMarkMonth4,
      this.mtSecuredMarkMonth5,
      this.mtSecuredMarkMonth6,
      this.mtSecuredMarkMonth7,
      this.mtSecuredMarkMonth8,
      this.mtSecuredMarkMonth9,
      this.mtSecuredMarkMonth10,
      this.mtSecuredMarkMonth11,
      this.mtSecuredMarkMonth12
    );
    this.maxMonthlyQuestion = Math.max(...this.totalMonthlyScore) + 5;
    this.mostTimeSpent = Math.max(...this.timeSpentInApp) + 10;
    this.max_question = this.baselineEndlineTotalMark;
    this.traingDataGraph();
    this.baselineEndlineGraph();
    this.timeSpentGraph();
  }

  public traingDataGraph() {
    this.lineChart = new Chart(this.training.nativeElement, {
      type: "line",
      data: {
        labels: [
          "january",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Auguest",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Total Mark",
            data: this.totalMonthlyScore || [],
            backgroundColor: "blue",
            borderColor: "lightblue",
            fill: false,
            lineTension: 0,
            pointRadius: 5,
          },
          {
            label: "Secured Mark",
            data: this.securedMonthlyScore || [],
            backgroundColor: "green",
            borderColor: "lightgreen",
            fill: false,
            lineTension: 0,
            pointRadius: 5,
          },
        ],
      },
      options: {
        title: {
          display: true,
          position: "bottom",
          text: "Monthly Traing Score ",
          fontSize: 16,
          fontColor: "#111",
        },
        legend: {
          display: true,
          position: "top",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                max: this.maxMonthlyQuestion,
                min: 0,
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
  }

  public timeSpentGraph() {
    this.barChart = new Chart(this.timeSpent.nativeElement, {
      type: "bar",
      data: {
        labels: [
          "january",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Auguest",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Monthly Time Spent",
            data: this.timeSpentInApp || [],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
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
                labelString: "Monthly Time Spent",
              },
            },
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                min: 0,
                max: this.mostTimeSpent,
                stepSize: 5,
              },
              scaleLabel: {
                display: true,
                labelString: "Monthly Time Spent in Minutes",
              },
            },
          ],
        },
      },
    });
  }

  public baselineEndlineGraph() {
    this.barChart = new Chart(this.baselienEndline.nativeElement, {
      type: "bar",
      data: {
        labels: ["Teacher Assessment Mark"],
        datasets: [
          {
            label: "Assessment",
            data: this.baselineEndlineMark || [],
            backgroundColor: ["rgba(75, 192, 192, 0.2)"],
            borderColor: ["rgba(75, 192, 192, 1)"],
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
                labelString: "Category Teacher Assessment",
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
                labelString: "Secured mark out of total assessment mark",
              },
            },
          ],
        },
      },
    });
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
            this.navController.navigateBack("profile");
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
