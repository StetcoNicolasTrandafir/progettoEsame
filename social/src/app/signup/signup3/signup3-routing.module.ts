import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Signup3Page } from './signup3.page';

const routes: Routes = [
  {
    path: '',
    component: Signup3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Signup3PageRoutingModule {}
