import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GeneralInstructionsPgePage } from './general-instructions-pge.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralInstructionsPgePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GeneralInstructionsPgePage]
})
export class GeneralInstructionsPgePageModule {}
