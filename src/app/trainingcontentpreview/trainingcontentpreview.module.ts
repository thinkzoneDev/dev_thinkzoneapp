import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { TrainingcontentpreviewPage } from "./trainingcontentpreview.page";
import { TranslateModule } from "@ngx-translate/core";
import { NgxTimerModule } from "ngx-timer";

const routes: Routes = [
  {
    path: "",
    component: TrainingcontentpreviewPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxTimerModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ],
  declarations: [TrainingcontentpreviewPage],
})
export class TrainingcontentpreviewPageModule {}
