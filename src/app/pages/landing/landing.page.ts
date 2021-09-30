import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonContent, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  constructor(
    private router: Router,
    public menuCtrl: MenuController
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {}

  explore_btn_click(){
    this.router.navigate(['/login']);
  }

  async logScrolling(event) {
    // Navigate to the Dashboard Page while reach bottom of page on scroll down
    let currentY = event.detail.currentY;
    const scrollElement = await this.content.getScrollElement();
    const pageHeightY = scrollElement.scrollHeight-scrollElement.clientHeight;
    //console.log('@@-> currentY = '+currentY+'--> pageHeightY = '+pageHeightY);

    if (currentY == pageHeightY) {
      this.router.navigate(['/login']);
    } else {
      console.log('@@-> Page Y = '+event.detail.currentY);
    }
  }
}