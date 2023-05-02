import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CifradoPageRoutingModule } from './cifrado-routing.module';

import { CifradoPage } from './cifrado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CifradoPageRoutingModule,
  ],
  declarations: [CifradoPage],
})
export class CifradoPageModule {}
