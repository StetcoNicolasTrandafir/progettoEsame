import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestpagePage } from './requestpage.page';

const routes: Routes = [
  {
    path: '',
    component: RequestpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestpagePageRoutingModule {}
