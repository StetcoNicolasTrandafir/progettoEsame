import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnswerarchivePageRoutingModule } from './answerarchive-routing.module';

import { AnswerarchivePage } from './answerarchive.page';
import {ReceivedanswerComponent} from "./receivedanswer/receivedanswer.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnswerarchivePageRoutingModule
  ],
    declarations: [AnswerarchivePage, ReceivedanswerComponent]
})
export class AnswerarchivePageModule {}
