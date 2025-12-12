// src/app/domain/auth/guards/validate-code.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ValidateCodeGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const email = localStorage.getItem('reset_email');

    if (email) {
      return true; // usuário pode acessar a página
    } else {
      // usuário tentou acessar direto → redireciona para login ou forgot-password
      this.router.navigate(['/auth/forgot-password']);
      return false;
    }
  }
}
