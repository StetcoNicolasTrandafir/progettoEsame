import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionarchivePage } from './questionarchive.page';

const routes: Routes = [
  {
    path: '',
    component: QuestionarchivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionarchivePageRoutingModule {}
