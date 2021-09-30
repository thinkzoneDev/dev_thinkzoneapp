import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
// import { IconpopoverComponent } from '../iconpopover/iconpopover.component';
//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { PPTContentDetailsPage } from './pptcontentdetails.page'
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: PPTContentDetailsPage
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
  entryComponents:[],
  declarations: [
    PPTContentDetailsPage,
    // IconpopoverComponent
    //, PopmenuComponent
  ]
})

export class PPTContentDetailsPageModule {}
