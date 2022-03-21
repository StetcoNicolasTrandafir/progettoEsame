import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page,
  },
  {
    path: 'modal-answer',
    loadChildren: () => import('./modal-answer/modal-answer.module').then( m => m.ModalAnswerPageModule)
  },  {
    path: 'modal-filter-categories',
    loadChildren: () => import('./modal-filter-categories/modal-filter-categories.module').then( m => m.ModalFilterCategoriesPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
