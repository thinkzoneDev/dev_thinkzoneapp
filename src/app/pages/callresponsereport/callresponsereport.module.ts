import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { CallresponsereportPage } from "./callresponsereport.page";

import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: CallresponsereportPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  declarations: [CallresponsereportPage],
})
export class CallresponsereportPageModule {}
