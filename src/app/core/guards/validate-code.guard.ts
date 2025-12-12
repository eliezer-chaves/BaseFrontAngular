import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RecoveryFlowGuard implements CanActivate {

  constructor(private router: Router) {}

  private hasFlowCookie(): boolean {
    return document.cookie.split('; ')
      .some(row => row.startsWith('recovery_flow='));
  }

  canActivate(): boolean {
    if (!this.hasFlowCookie()) {
      this.router.navigate(['/auth/forgot-password']);
      return false;
    }
    return true;
  }
}
