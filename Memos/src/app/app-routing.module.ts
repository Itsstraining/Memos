import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'promo', loadChildren: () => import('./pages/promo/promo.module').then(m => m.PromoModule) },
  { path: 'note-page', loadChildren: () => import('./pages/note-page/note-page.module').then(m => m.NotePageModule) },
  { path: 'archive-page', loadChildren: () => import('./pages/archive-page/archive-page.module').then(m => m.ArchivePageModule) },
  { path: 'trash-page', loadChildren: () => import('./pages/trash-page/trash-page.module').then(m => m.TrashPageModule) },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
