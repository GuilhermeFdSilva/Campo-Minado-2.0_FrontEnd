import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EasyComponent } from './easy/easy.component';
import { HardComponent } from './hard/hard.component';

const routes: Routes = [
  { path: '', redirectTo: 'facil', pathMatch: 'full' },
  { path: 'facil', component: EasyComponent },
  { path: 'dificil', component: HardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
