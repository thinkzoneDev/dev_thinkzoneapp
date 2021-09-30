import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { PopmenuComponent } from "./../../components/popmenu/popmenu.component";

import { HomeResultsPage } from "./home-results.page";
import { TranslateModule } from "@ngx-translate/core";

// import { IconpopoverComponent } from '../iconpopover/iconpopover.component';
const routes: Routes = [
  {
    path: "",
    component: HomeResultsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
  ],
  declarations: [HomeResultsPage, PopmenuComponent],

  // entryComponents:[IconpopoverComponent]
  // declarations: [
  //   HomeResultsPage,
  //   IconpopoverComponent
  //   //, PopmenuComponent
  // ]
})

// export class HomeResultsPageModule {}
// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Routes, RouterModule } from '@angular/router';
// import { IonicModule } from '@ionic/angular';
// import { IconpopoverComponent } from '../iconpopover/iconpopover.component';
// //import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

// import { TrainingContentPage } from './trainingcontent.page'
// import { TranslateModule } from '@ngx-translate/core';

// const routes: Routes = [
//   {
//     path: '',
//     component: TrainingContentPage
//   }
// ];

// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     IonicModule,
//     TranslateModule.forChild(),
//     RouterModule.forChild(routes)
//   ],
//   entryComponents:[IconpopoverComponent],
//   declarations: [
//     TrainingContentPage,
//     IconpopoverComponent
//     //, PopmenuComponent
//   ]
// })
export class HomeResultsPageModule {}
