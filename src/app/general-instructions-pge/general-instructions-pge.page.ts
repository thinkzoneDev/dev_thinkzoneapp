import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-general-instructions-pge',
  templateUrl: './general-instructions-pge.page.html',
  styleUrls: ['./general-instructions-pge.page.scss'],
})
export class GeneralInstructionsPgePage implements OnInit {
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
