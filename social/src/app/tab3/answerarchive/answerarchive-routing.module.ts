import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnswerarchivePage } from './answerarchive.page';

const routes: Routes = [
  {
    path: '',
    component: AnswerarchivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnswerarchivePageRoutingModule {}
