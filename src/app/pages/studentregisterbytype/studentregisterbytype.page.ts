import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { HblRegisterPage } from "../hbl-register/hbl-register.page";
import { StudentregisterPage } from "../studentregister/studentregister.page";

@Component({
  selector: "app-studentregisterbytype",
  templateUrl: "./studentregisterbytype.page.html",
  styleUrls: ["./studentregisterbytype.page.scss"],
})
export class StudentregisterbytypePage implements OnInit {
  constructor(public modalController: ModalController, public router: Router) {}

  ngOnInit() {}

  async openHBLRegisterModal(studentObj, flag) {
    const modal = await this.modalController.create({
      component: HblRegisterPage,
      componentProps: { res: { flag: flag, studentObj: studentObj } },
    });
    modal.onDidDismiss().then((data) => {
      // this.getallstudents_hbl(this._userid);
    });
    return await modal.present();
  }

  async openRegisterModal(studentObj, flag) {
    const modal = await this.modalController.create({
      component: StudentregisterPage,
      componentProps: { res: { flag: flag, studentObj: studentObj } },
    });
    modal.onDidDismiss().then((data) => {
      // this.getallstudents(this._userid);
    });
    return await modal.present();
  }

  onClickClose() {
    this.modalController.dismiss();
  }

  closeModal() {
    this.modalController.dismiss(null, "backdrop");
  }

  startCapture(type) {
    this.modalController.dismiss(type, "select");
  }
}
