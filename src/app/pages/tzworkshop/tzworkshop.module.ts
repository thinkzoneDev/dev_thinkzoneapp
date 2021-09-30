import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { TzworkshopPage } from "./tzworkshop.page";

//Material import

const routes: Routes = [
  {
    path: "",
    component: TzworkshopPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
  ],
  declarations: [TzworkshopPage],
})
export class TzworkshopPageModule {}

//TZ Workshop

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Routes, RouterModule } from '@angular/router';

// import { IonicModule } from '@ionic/angular';
// import { TranslateModule } from '@ngx-translate/core';
// import { TzworkshopPage } from './tzworkshop.page';

// const routes: Routes = [
//   {
//     path: '',
//     component: TzworkshopPage
//   }
// ];

// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     TranslateModule.forChild(),
//     RouterModule.forChild(routes)
//   ],
//   declarations: [TzworkshopPage]
// })
// export class TzworkshopPageModule {}
