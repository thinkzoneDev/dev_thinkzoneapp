import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Statusmodal1Page } from './statusmodal1.page';

const routes: Routes = [
  {
    path: '',
    component: Statusmodal1Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Statusmodal1Page]
})
export class Statusmodal1PageModule {}
