import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditprofilemodalPage } from './editprofilemodal.page';

const routes: Routes = [
  {
    path: '',
    component: EditprofilemodalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditprofilemodalPage]
})
export class EditprofilemodalPageModule {}
