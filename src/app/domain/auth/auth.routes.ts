// src/app/domain/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { ValidateCodeGuard } from '../../core/guards/validate-code.guard';

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
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('../../domain/auth/pages/forgot-password.page/forgot-password.component').then(m => m.ForgotPasswordPageComponent)
  },
  {
    path: 'validate-code',
    loadComponent: () => import('../../domain/auth/pages/validate-code.page/validate-code.page.component').then(m => m.ValidateCodePageComponent),
    canActivate: [ValidateCodeGuard]

  }
];