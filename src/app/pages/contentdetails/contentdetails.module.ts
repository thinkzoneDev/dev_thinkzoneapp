import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
// import { IconpopoverComponent } from '../iconpopover/iconpopover.component';
//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { ContentDetailsPage } from './contentdetails.page'
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ContentDetailsPage
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
    ContentDetailsPage,
    // IconpopoverComponent
    //, PopmenuComponent
  ]
})

export class ContentDetailsPageModule {}
