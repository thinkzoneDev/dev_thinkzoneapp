import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { CallresponsePage } from "./callresponse.page";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: CallresponsePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  // entryComponents: [CallresponsePage],
  declarations: [CallresponsePage],
})
export class CallresponsePageModule {}
