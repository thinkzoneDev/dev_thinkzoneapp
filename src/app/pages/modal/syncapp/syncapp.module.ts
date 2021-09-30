import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SyncappPage } from './syncapp.page';

const routes: Routes = [
  {
    path: '',
    component: SyncappPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SyncappPage],
  entryComponents: [SyncappPage]
})
export class SyncappPageModule {}
