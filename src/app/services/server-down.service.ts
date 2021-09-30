import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class ServerDownService {
  constructor(public toastCtrl: ToastController) {}

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: "Network issue. Please try after sometime.",
      duration: 3000,
      position: "bottom",
    });
    toast.present();
  }
}
