import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GeneralInstructionsPage } from './general-instructions.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralInstructionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GeneralInstructionsPage]
})
export class GeneralInstructionsPageModule {}
