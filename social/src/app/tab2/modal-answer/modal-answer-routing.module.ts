import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAnswerPage } from './modal-answer.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAnswerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAnswerPageRoutingModule {}
