import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnswerpagePageRoutingModule } from './answerpage-routing.module';

import { AnswerpagePage } from './answerpage.page';
import {AnswerComponent} from "./answer/answer.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnswerpagePageRoutingModule
  ],
    declarations: [AnswerpagePage, AnswerComponent]
})
export class AnswerpagePageModule {}
