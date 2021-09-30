import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(  public alertController: AlertController, public navController: NavController) { }

  ngOnInit() {}

  // close modal
  navigateback() {
    this.navController.navigateBack('/tzworkshop');
  }
}
