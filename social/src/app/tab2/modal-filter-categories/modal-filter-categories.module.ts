import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalFilterCategoriesPageRoutingModule } from './modal-filter-categories-routing.module';

import { ModalFilterCategoriesPage } from './modal-filter-categories.page';
import { CategoryComponent } from './category/category.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalFilterCategoriesPageRoutingModule
  ],
  declarations: [ModalFilterCategoriesPage,CategoryComponent]
})
export class ModalFilterCategoriesPageModule {}
