import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ResetPasswordGuard implements CanActivate {

  constructor(private router: Router) {}

  private hasValidatedStage(): boolean {
    return document.cookie
      .split('; ')
      .some(c => c.startsWith('recovery_stage=validated'));
  }

  canActivate(): boolean {
    if (!this.hasValidatedStage()) {
      this.router.navigate(['/auth/validate-code']);
      return false;
    }
    return true;
  }
}
