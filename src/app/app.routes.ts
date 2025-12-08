// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { AUTH_ROUTES } from './domain/auth/auth.routes';
import { DASHBOARD_ROUTES } from './domain/dashboard/dashboard.routes'
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./core/layout/auth.layout/auth.layout.component').then(m => m.AuthLayoutComponent),
    children: AUTH_ROUTES
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/dashboard.layout/dashboard.layout.component').then(m => m.DashboardLayoutComponent),
    children: DASHBOARD_ROUTES
  }
];