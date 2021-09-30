import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { IconpopoverComponent } from "../iconpopover/iconpopover.component";
//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { StudentExplorPage } from "./studentexplor.page";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
    {
        path: "",
        component: StudentExplorPage,
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
    entryComponents: [IconpopoverComponent],
    declarations: [
        StudentExplorPage,
        IconpopoverComponent,
        //, PopmenuComponent
    ],
})
export class StudentExplorPageModule {}
