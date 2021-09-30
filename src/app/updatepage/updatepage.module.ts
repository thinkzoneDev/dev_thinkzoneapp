import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { UpdatepagePage } from "./updatepage.page";

import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: UpdatepagePage,
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
  declarations: [UpdatepagePage],
})
export class UpdatepagePageModule {}
