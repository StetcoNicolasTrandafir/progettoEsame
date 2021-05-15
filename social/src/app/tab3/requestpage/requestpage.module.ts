import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestpagePageRoutingModule } from './requestpage-routing.module';

import { RequestpagePage } from './requestpage.page';
import {RequestComponent} from "./request/request.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestpagePageRoutingModule
  ],
    declarations: [RequestpagePage, RequestComponent]
})
export class RequestpagePageModule {}
