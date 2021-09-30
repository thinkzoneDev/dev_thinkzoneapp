import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { TrainingPgassessmentPage } from './trainingpgassessment.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: TrainingPgassessmentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TrainingPgassessmentPage
    //, PopmenuComponent
  ]
})
export class PgassessmentTrainingPageModule {}
