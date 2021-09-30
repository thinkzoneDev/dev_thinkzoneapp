import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import {TermsAndConditionsPage} from '../terms-and-conditions/terms-and-conditions.page'
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-tools',
  templateUrl: './tools.page.html',
  styleUrls: ['./tools.page.scss'],
})
export class ToolsPage implements OnInit {

  constructor(private route:Router ,private iab: InAppBrowser,private file:File,
     private modelctrl:ModalController,private fileOpener: FileOpener) { }

  ngOnInit() {
  }
  
  onDictionary(){
    this.route.navigate(["/dictionary"]);
  }

  onFeedback(){
    this.route.navigateByUrl("/feedback_new")
  }

 async onPrivacy(){
    const modal = await this.modelctrl.create({
      component: TermsAndConditionsPage
    });
    return await modal.present();
  }
  // this.route.navigateByUrl("/terms-and-conditions")
}


