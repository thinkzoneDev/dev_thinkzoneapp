import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage {
  @ViewChild(IonContent) content: IonContent;
  constructor(private router: Router) {}

  closeIt(){
    this.router.navigate(['/home-results']);
  }

  async logScrolling(event) {
    // Navigate to the Dashboard Page while reach bottom of page on scroll down
    let currentY = event.detail.currentY;
    const scrollElement = await this.content.getScrollElement();
    const pageHeightY = scrollElement.scrollHeight-scrollElement.clientHeight;
    //console.log('@@-> currentY = '+currentY+'--> pageHeightY = '+pageHeightY);

    if (currentY == pageHeightY) {
      this.router.navigate(['/home-results']);
    } else {
      console.log('@@-> Page Y = '+event.detail.currentY);
    }
  }
}
