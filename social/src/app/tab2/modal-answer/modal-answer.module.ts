import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAnswerPageRoutingModule } from './modal-answer-routing.module';

import { ModalAnswerPage } from './modal-answer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAnswerPageRoutingModule
  ],
  declarations: [ModalAnswerPage]
})
export class ModalAnswerPageModule {}
