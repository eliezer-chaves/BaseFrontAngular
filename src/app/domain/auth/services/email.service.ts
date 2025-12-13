// email.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private email: string | null = null;
  private expiresAt = null;

  setEmail(email: string): void {
    this.email = email;
  }

  getEmail(): string | null {
    return this.email;
  }

  setExpiresAt(expires_at: any): void{
    this.expiresAt = expires_at
  }

  getExpiresAt(){
    return this.expiresAt
  }
}
