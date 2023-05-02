import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CifradoPage } from './cifrado.page';

const routes: Routes = [
  {
    path: '',
    component: CifradoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CifradoPageRoutingModule {}
