import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ContentdetailsmodalPage } from "./contentdetailsmodal.page";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
    {
        path: "",
        component: ContentdetailsmodalPage,
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
    declarations: [ContentdetailsmodalPage],
})
export class ContentdetailsmodalPageModule {}
