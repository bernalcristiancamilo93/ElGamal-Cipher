import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'cifrado',
    loadChildren: () =>
      import('./cifrado/cifrado.module').then((m) => m.CifradoPageModule),
  },
  {
    path: '',
    redirectTo: 'cifrado',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'cifrado',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
