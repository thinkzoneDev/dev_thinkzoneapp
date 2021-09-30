import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuizPage } from './quiz.page';
import { NgxTimerModule } from 'ngx-timer';
import { TranslateModule } from "@ngx-translate/core";
const routes: Routes = [
  {
    path: '',
    component: QuizPage
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
  declarations: [QuizPage]
})
export class QuizPageModule {}
