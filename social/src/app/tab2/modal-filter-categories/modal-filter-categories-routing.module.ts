import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalFilterCategoriesPage } from './modal-filter-categories.page';

const routes: Routes = [
  {
    path: '',
    component: ModalFilterCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalFilterCategoriesPageRoutingModule {}
