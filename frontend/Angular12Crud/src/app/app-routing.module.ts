import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Pm2ListComponent } from './components/pm2-list/pm2-list.component';
import { ErrorComponent } from './components/error/error.component';
import { ChartComponent } from './components/chart/chart.component';
import { HomeComponent } from './components/home/home.component';



const routes: Routes = [
  { path: '', redirectTo: 'tutorials', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'pm2list', component: Pm2ListComponent },
  { path: 'issues', component: ErrorComponent },
  { path: 'chart', component: ChartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
