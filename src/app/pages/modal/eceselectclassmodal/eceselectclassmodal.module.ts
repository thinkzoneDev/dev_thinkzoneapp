import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "src/app/components/components.module";
import { TranslateModule } from "@ngx-translate/core";

import { EceselectclassmodalPage } from "./eceselectclassmodal.page";

const routes: Routes = [
  {
    path: "",
    component: EceselectclassmodalPage,
  },
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
  ],
  declarations: [EceselectclassmodalPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class EceselectclassmodalPageModule {}
