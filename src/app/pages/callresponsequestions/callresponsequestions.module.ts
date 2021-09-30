import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CallresponsequestionsPage } from './callresponsequestions.page';

const routes: Routes = [
  {
    path: '',
    component: CallresponsequestionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CallresponsequestionsPage]
})
export class CallresponsequestionsPageModule {}
