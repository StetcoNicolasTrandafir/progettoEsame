import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Signup3PageRoutingModule } from './signup3-routing.module';

import { Signup3Page } from './signup3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Signup3PageRoutingModule
  ],
  declarations: [Signup3Page]
})
export class Signup3PageModule {}
