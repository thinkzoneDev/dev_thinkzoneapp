import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { Ecactivity1Page } from './ecactivity1.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: Ecactivity1Page
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [
    Ecactivity1Page
    // PopmenuComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Ecactivity1PageModule {}
