import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { TrainingFilePage } from './trainingfiles.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: TrainingFilePage
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TrainingFilePage
    //, PopmenuComponent
  ]
})
export class TrainingFilePageModule {}
