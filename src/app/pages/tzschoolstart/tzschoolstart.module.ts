import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { TzschoolstartPage } from './tzschoolstart.page';

const routes: Routes = [
  {
    path: '',
    component: TzschoolstartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [TzschoolstartPage]
})
export class TzschoolstartPageModule {}
