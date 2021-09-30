import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-hrpolicy",
  templateUrl: "./hrpolicy.page.html",
  styleUrls: ["./hrpolicy.page.scss"],
})
export class HrpolicyPage implements OnInit {
  constructor(public modalCtrl: ModalController) {}
  toolbarshadow = true;
  ngOnInit() {}
}
