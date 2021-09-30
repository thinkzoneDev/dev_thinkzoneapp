import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-general-instructions',
  templateUrl: './general-instructions.page.html',
  styleUrls: ['./general-instructions.page.scss'],
})
export class GeneralInstructionsPage implements OnInit {
  selectedLanguage: string;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    this.selectedLanguage = localStorage.getItem('_language');
  }
  onClose()
  {
    this.modalCtrl.dismiss();
  }
}
