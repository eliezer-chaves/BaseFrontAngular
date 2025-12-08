// src/app/domain/auth/auth.routes.ts
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('../../domain/auth/pages/login.page/login.page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'create-account',
    loadComponent: () => import('../../domain/auth/pages/create-account.page/create-account.page.component').then(m => m.CreateAccountPageComponent)
  }
];