import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnswerpagePage } from './answerpage.page';

const routes: Routes = [
  {
    path: '',
    component: AnswerpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnswerpagePageRoutingModule {}
