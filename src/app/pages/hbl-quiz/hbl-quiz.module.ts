import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { HblQuizPage } from "./hbl-quiz.page";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: HblQuizPage,
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
  declarations: [HblQuizPage],
})
export class HblQuizPageModule {}
