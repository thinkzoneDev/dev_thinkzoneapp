import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PPTQuizPage } from './pptquiz.page';
import { NgxTimerModule } from 'ngx-timer';
import { TranslateModule } from "@ngx-translate/core";
const routes: Routes = [
  {
    path: '',
    component: PPTQuizPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxTimerModule,
    TranslateModule
  ],
  declarations: [PPTQuizPage]
})
export class PPTQuizPageModule {}
