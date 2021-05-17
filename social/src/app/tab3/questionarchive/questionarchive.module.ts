import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestionarchivePageRoutingModule } from './questionarchive-routing.module';

import { QuestionarchivePage } from './questionarchive.page';
import {QuestionComponent} from "./question/question.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuestionarchivePageRoutingModule
  ],
    declarations: [QuestionarchivePage, QuestionComponent]
})
export class QuestionarchivePageModule {}
