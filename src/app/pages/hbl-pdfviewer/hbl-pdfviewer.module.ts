import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { HblPdfviewerPage } from "./hbl-pdfviewer.page";
import { PdfViewerModule } from "ng2-pdf-viewer";
const routes: Routes = [
  {
    path: "",
    component: HblPdfviewerPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PdfViewerModule,
  ],
  declarations: [HblPdfviewerPage],
})
export class HblPdfviewerPageModule {}
