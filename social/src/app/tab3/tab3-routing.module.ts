import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';

const routes: Routes = [
  {
    path: '',
    component: Tab3Page,
  },
  {
    path: 'requestpage/:id',
    loadChildren: () => import('./requestpage/requestpage.module').then( m => m.RequestpagePageModule)
  },
  {
    path: 'insertquestionpage',
    loadChildren: () => import('./insertquestionpage/insertquestionpage.module').then( m => m.InsertquestionpagePageModule)
  },
  {
    path: 'answerpage/:id',
    loadChildren: () => import('./answerpage/answerpage.module').then( m => m.AnswerpagePageModule)
  },
  {
    path: 'questionarchive',
    loadChildren: () => import('./questionarchive/questionarchive.module').then( m => m.QuestionarchivePageModule)
  },
  {
    path: 'profile/:id',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },  {
    path: 'answerarchive',
    loadChildren: () => import('./answerarchive/answerarchive.module').then( m => m.AnswerarchivePageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {}
