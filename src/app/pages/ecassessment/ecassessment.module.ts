import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { EcassessmentPage } from './ecassessment.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: EcassessmentPage
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
    EcassessmentPage
    //, PopmenuComponent
  ]
})
export class EcassessmentPageModule {}
