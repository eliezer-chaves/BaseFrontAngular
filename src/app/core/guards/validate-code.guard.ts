
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { EmailService } from '../../domain/auth/services/email.service';

@Injectable({ providedIn: 'root' })
export class ValidateCodeGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router, private emailService: EmailService) {}
  private API_URL = environment.apiUrl;

  canActivate(): Observable<boolean> {
    return this.http.get<{email: string, expires_at: any}>(`${this.API_URL}/auth/has-cookie`, {
          withCredentials: true
        }).pipe(
      map(res => {
        this.emailService.setEmail(res.email)

        this.emailService.setExpiresAt(res.expires_at)

        return true;
      }),
      catchError(err => {
        // Cookie inválido ou ausente, backend retornou 403
        this.router.navigate(['/auth/forgot-password']);
        return of(false);
      })
    );
  }
}
