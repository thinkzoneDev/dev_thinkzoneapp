import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gallary-model',
  templateUrl: './gallary-model.page.html',
  styleUrls: ['./gallary-model.page.scss'],
})
export class GallaryModelPage implements OnInit {
img:any;
  constructor(private navParams:NavParams, private modalController:ModalController) { }

  ngOnInit() {
    this.img=this.navParams.get('img')
  }
zoom(zoomIn:boolean)
{

}
close()
{
this.modalController.dismiss()
}
}
