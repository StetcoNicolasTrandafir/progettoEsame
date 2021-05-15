import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsertquestionpagePage } from './insertquestionpage.page';

const routes: Routes = [
  {
    path: '',
    component: InsertquestionpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsertquestionpagePageRoutingModule {}
