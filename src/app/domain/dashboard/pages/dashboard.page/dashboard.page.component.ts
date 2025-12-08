import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AsyncPipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-dashboard.page',
  imports: [NzButtonModule, AsyncPipe, TranslocoModule],
  templateUrl: './dashboard.page.component.html',
  styleUrl: './dashboard.page.component.css'
})
export class DashboardPageComponent {
  isLoading = false;

  $user;

  constructor(private authService: AuthService) {
    this.$user = this.authService.currentUser$;
    
  }

  logout() {
  this.isLoading = true;

  this.authService.logout().subscribe({
    next: () => {
      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
    }
  });
}

}
