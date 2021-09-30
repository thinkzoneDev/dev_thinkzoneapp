import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { IndivisualUserPerformancePage } from "./indivisual-user-performance.page";
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: IndivisualUserPerformancePage,
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
  declarations: [IndivisualUserPerformancePage],
})
export class IndivisualUserPerformancePageModule {}
