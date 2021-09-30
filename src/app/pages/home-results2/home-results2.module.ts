import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { HomeResults2Page } from './home-results2.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: HomeResults2Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [HomeResults2Page]
})
export class HomeResults2PageModule {}
