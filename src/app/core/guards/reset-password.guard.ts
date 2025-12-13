import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ResetPasswordGuard implements CanActivate {

  constructor(private router: Router) {}

  private hasValidatedStage() {
    
  }

  canActivate(): boolean {
   
    return true;
  }
}
