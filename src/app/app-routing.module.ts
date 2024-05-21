import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EasyComponent } from './main/easy/easy.component';
import { HardComponent } from './main/hard/hard.component';

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
