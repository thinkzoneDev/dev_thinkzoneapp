import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
// Ionic Auto-complete
import { AutoCompleteModule } from 'ionic4-auto-complete';

import { DictionaryPage } from './dictionary.page';

const routes: Routes = [
  {
    path: '',
    component: DictionaryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DictionaryPage]
})
export class DictionaryPageModule {}
