import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HrpolicyPage } from './hrpolicy.page';

const routes: Routes = [
  {
    path: '',
    component: HrpolicyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HrpolicyPage]
})
export class HrpolicyPageModule {}
