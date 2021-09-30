import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tzworkstart',
  templateUrl: './tzworkstart.page.html',
  styleUrls: ['./tzworkstart.page.scss'],
})
export class TzworkstartPage implements OnInit {

  constructor(
    public alertController: AlertController,
    public navController: NavController
  ) { }

  ngOnInit() {
  }
  startProgram(){
    this.showConfirm('Confirmation !!!', '', 'Are you sure you want to start the program?', '');
  }
   // confirm box
   async showConfirm(header: string, subHeader: string, message: string, body: any) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.navController.navigateBack('/tzworkleap');
          }
        }
      ]
    });
    await alert.present();
  }
   // close modal
   back() {
    this.navController.navigateBack('/tzworkshop');
  }

}
