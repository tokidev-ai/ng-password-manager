import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'passwords', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'passwords',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/passwords/password-list/password-list.component').then(
        (m) => m.PasswordListComponent,
      ),
  },
  { path: '**', redirectTo: 'passwords' },
];
