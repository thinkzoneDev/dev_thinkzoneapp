import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { RegisterPage } from "./register.page";
import { TranslateModule } from "@ngx-translate/core";
import { IonicSelectableModule } from "ionic-selectable";

const routes: Routes = [
  {
    path: "",
    component: RegisterPage,
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
    IonicSelectableModule,
  ],
  declarations: [RegisterPage],
})
export class RegisterPageModule {}
