import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsertquestionpagePageRoutingModule } from './insertquestionpage-routing.module';

import { InsertquestionpagePage } from './insertquestionpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsertquestionpagePageRoutingModule
  ],
  declarations: [InsertquestionpagePage]
})
export class InsertquestionpagePageModule {}
