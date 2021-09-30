import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TeacherBaselinePage } from './teacherbaselinedndline.page';
import { NgxTimerModule } from 'ngx-timer';
import { TranslateModule } from '@ngx-translate/core';
const routes: Routes = [
  {
    path: '',
    component: TeacherBaselinePage
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
  declarations: [TeacherBaselinePage]
})
export class TeacherBaselinePageModule {}
