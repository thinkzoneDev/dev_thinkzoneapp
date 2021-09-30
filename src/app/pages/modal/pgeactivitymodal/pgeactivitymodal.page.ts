import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-pgeactivitymodal",
  templateUrl: "./pgeactivitymodal.page.html",
  styleUrls: ["./pgeactivitymodal.page.scss"],
})
export class PgeactivitymodalPage implements OnInit {
  constructor(public modalController: ModalController, public router: Router) {}

  ngOnInit() {}

  openMathActivity() {
    this.router.navigate(["/pgemathactivity"]);
    this.modalController.dismiss();
  }

  openEnglishActivity() {
    this.router.navigate(["/pgeenglishactivity"]);
    this.modalController.dismiss();
  }

  openOdiaActivity() {
    this.router.navigate(["/pgeodiaactivity"]);
    this.modalController.dismiss();
  }

  onClickClose() {
    this.modalController.dismiss();
  }
}
