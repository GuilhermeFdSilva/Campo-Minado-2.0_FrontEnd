import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { EasyComponent } from './main/easy/easy.component';
import { MediumComponent } from './main/medium/medium.component';
import { HardComponent } from './main/hard/hard.component';

const routes: Routes = [
  { path: '', redirectTo: 'facil', pathMatch: 'full' },
  {
    path: '', component: MainComponent, children: [
      { path: 'facil', component: EasyComponent },
      { path: 'medio', component: MediumComponent },
      { path: 'dificil', component: HardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
