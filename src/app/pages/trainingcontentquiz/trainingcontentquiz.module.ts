import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { TrainingcontentquizPage } from "./trainingcontentquiz.page";
import { NgxTimerModule } from "ngx-timer";

const routes: Routes = [
    {
        path: "",
        component: TrainingcontentquizPage,
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        NgxTimerModule,
    ],
    declarations: [TrainingcontentquizPage],
})
export class TrainingcontentquizPageModule {}
