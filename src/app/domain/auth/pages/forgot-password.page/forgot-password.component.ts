import { Component, inject, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ButtonLanguageComponent } from '../../../../core/components/button-language/button-language.component';
import { ButtonThemeComponent } from '../../../../core/components/button-theme/button-theme.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../../../core/services/auth.service';
import { ErrorTranslationService } from '../../../../core/services/error-translation.service';
import { environment } from '../../../../environments/environment';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, ReactiveFormsModule, FormsModule, NzFormModule, NzSelectModule, NzGridModule, NzDatePickerModule, NzRadioModule, NzInputModule, NzCheckboxModule, NzButtonModule, NzIconModule, NzInputNumberModule, NzTypographyModule, NzFlexModule, TranslocoModule, NzDividerComponent, ButtonLanguageComponent, ButtonThemeComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordPageComponent implements OnDestroy {
  loadingService = inject(LoadingService);
  isLoading = false;
  minLenghtPassword: number = environment.passwordMinLenght;

  // Controle do timer
  countdown: number = 0;
  private countdownInterval: any;
  private readonly COOLDOWN_KEY = 'email_resend_cooldown';
  private readonly COOLDOWN_DURATION = 60; // 60 segundos

  private fb = inject(NonNullableFormBuilder);
  
  constructor(
    private authService: AuthService,
    private notificationService: NzNotificationService,
    private translocoService: TranslocoService,
    private errorTranslationService: ErrorTranslationService,
    private router: Router
  ) {
    this.checkExistingCooldown();
  }

  validateForm = this.fb.group({
    usr_email: this.fb.control('', [Validators.required, Validators.email]),
  });

  // Verifica se existe um cooldown ativo ao carregar o componente
  private checkExistingCooldown(): void {
    const cooldownEnd = localStorage.getItem(this.COOLDOWN_KEY);
    if (cooldownEnd) {
      const remaining = Math.floor((parseInt(cooldownEnd) - Date.now()) / 1000);
      if (remaining > 0) {
        this.startCountdown(remaining);
      } else {
        localStorage.removeItem(this.COOLDOWN_KEY);
      }
    }
  }

  // Inicia o contador regressivo
  private startCountdown(seconds: number = this.COOLDOWN_DURATION): void {
    this.countdown = seconds;
    
    // Salva o tempo de expiração no localStorage
    const expirationTime = Date.now() + (seconds * 1000);
    localStorage.setItem(this.COOLDOWN_KEY, expirationTime.toString());

    // Limpa qualquer intervalo anterior
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    // Inicia o intervalo
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        localStorage.removeItem(this.COOLDOWN_KEY);
      }
    }, 1000);
  }

  submitForm() {
    if (this.validateForm.valid && this.countdown === 0) {
      this.isLoading = true;

      const { usr_email } = this.validateForm.value;
      if (usr_email) {
        this.authService.sendEmailCode(usr_email).subscribe({
          next: () => {
            const emailSend = {
              type: "email_send",
              title: "Email Sent",
              message: "Your email has been sent successfully! Please check your inbox, and don't forget to look in your spam/junk folder just in case it ended up there."
            };

            const { title, message } = this.errorTranslationService.translateBackendError(emailSend);
            this.notificationService.success(title, message);

            this.isLoading = false;
            
            // Inicia o cooldown de 60 segundos
            this.startCountdown();
            
            // Email existente → continuar fluxo
            localStorage.setItem('reset_email', usr_email);
            this.router.navigate(['/auth/validate-code']);
          },
          error: (err) => {
            const { title, message } = this.errorTranslationService.translateBackendError(err);
            this.notificationService.error(title, message);
            this.isLoading = false;
          }
        });
      }
    } else {
      // caso o formulário seja inválido
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  ngOnDestroy(): void {
    // Limpa o intervalo ao destruir o componente
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}