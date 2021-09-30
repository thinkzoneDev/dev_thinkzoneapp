import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-editprofilemodal",
  templateUrl: "./editprofilemodal.page.html",
  styleUrls: ["./editprofilemodal.page.scss"],
})
export class EditprofilemodalPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss(null, "backdrop");
  }

  startCapture(type) {
    this.modalController.dismiss(type, "select");
  }
}
