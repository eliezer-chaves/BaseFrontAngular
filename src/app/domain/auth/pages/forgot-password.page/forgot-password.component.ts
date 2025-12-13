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
  imports: [
    RouterLink, ReactiveFormsModule, FormsModule, NzFormModule,
    NzSelectModule, NzGridModule, NzDatePickerModule, NzRadioModule,
    NzInputModule, NzCheckboxModule, NzButtonModule, NzIconModule,
    NzInputNumberModule, NzTypographyModule, NzFlexModule, TranslocoModule,
    NzDividerComponent, ButtonLanguageComponent, ButtonThemeComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordPageComponent implements OnDestroy {
  loadingService = inject(LoadingService);
  isLoading = false;
  minLenghtPassword: number = environment.passwordMinLenght;
  private redirectTimeout: any;
  // Controle do timer (agora sincronizado com backend)
  countdown: number = 0;
  isBlocked: boolean = false;
  attemptsRemaining: number = 0;
  maxAttempts: number = 3;

  private countdownInterval: any;
  private readonly RATE_LIMIT_KEY = 'email_rate_limit';

  private fb = inject(NonNullableFormBuilder);

  constructor(
    private authService: AuthService,
    private notificationService: NzNotificationService,
    private translocoService: TranslocoService,
    private errorTranslationService: ErrorTranslationService,
    private router: Router
  ) {
    this.checkExistingRateLimit();
  }

  validateForm = this.fb.group({
    usr_email: this.fb.control('', [Validators.required, Validators.email]),
  });

  // Verifica se existe um rate limit ativo (pode ser do backend ou local)
  private checkExistingRateLimit(): void {
    const rateLimitData = localStorage.getItem(this.RATE_LIMIT_KEY);
    if (rateLimitData) {
      try {
        const data = JSON.parse(rateLimitData);

        if (data.blocked_until) {
          const blockedUntil = new Date(data.blocked_until);
          const now = new Date();

          if (blockedUntil > now) {
            const remainingSeconds = Math.floor((blockedUntil.getTime() - now.getTime()) / 1000);
            this.startCountdown(remainingSeconds, true);
          } else {
            // Expirou, limpa
            localStorage.removeItem(this.RATE_LIMIT_KEY);
          }
        }
      } catch (e) {
        localStorage.removeItem(this.RATE_LIMIT_KEY);
      }
    }
  }

  // Inicia o contador regressivo
  private startCountdown(seconds: number, blocked: boolean = false): void {
    this.countdown = seconds;
    this.isBlocked = blocked;

    // Limpa qualquer intervalo anterior
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    // Inicia o intervalo
    this.countdownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.isBlocked = false;
        localStorage.removeItem(this.RATE_LIMIT_KEY);
      }
    }, 1000);
  }

  // Processa informações de rate limit do backend
  private handleRateLimitInfo(data: any): void {
    if (data.rate_limit) {
      this.attemptsRemaining = data.rate_limit.remaining_attempts;
      this.maxAttempts = data.rate_limit.max_attempts;

      if (this.attemptsRemaining === 1) {
        this.notificationService.warning(
          this.translocoService.translate('domain.auth.pages.forgotPassword.rateLimitWarningTitle'),
          this.translocoService.translate('domain.auth.pages.forgotPassword.lastAttempt')
        );
      } else if (this.attemptsRemaining > 1) {
        this.notificationService.warning(
          this.translocoService.translate('domain.auth.pages.forgotPassword.rateLimitWarningTitle'),
          this.translocoService.translate('domain.auth.pages.forgotPassword.attemptsRemaining', {
            remaining: this.attemptsRemaining,
            max: this.maxAttempts
          })
        );
      }

    }
  }

  // Processa erro de rate limit excedido
  private handleRateLimitError(error: any): void {
    console.log(">>> ENTROU NO handleRateLimitError <<<");

    const detail = error.error?.detail || error.error;

    if (detail.blocked_until && detail.remaining_seconds) {
      // Salva no localStorage para persistir entre recargas
      localStorage.setItem(this.RATE_LIMIT_KEY, JSON.stringify({
        blocked_until: detail.blocked_until,
        remaining_seconds: detail.remaining_seconds
      }));

      // Inicia o countdown
      this.startCountdown(detail.remaining_seconds, true);

      // Mostra notificação customizada
      const minutes = Math.ceil(detail.remaining_seconds / 60);
      this.notificationService.error(
        this.translocoService.translate('domain.auth.pages.forgotPassword.rateLimitBlockedTitle'),
        this.translocoService.translate('domain.auth.pages.forgotPassword.rateLimitBlockedMessage', {
          minutes: minutes
        }),
        { nzDuration: 5000 }
      );
    }
  }

  //Forgot Password
  submitForm() {
    if (this.validateForm.valid && !this.isBlocked) {
      this.isLoading = true;

      const { usr_email } = this.validateForm.value;
      if (usr_email) {
        this.authService.sendResetCode(usr_email).subscribe({
          next: (response) => {
            // Após enviar e-mail com sucesso
            this.startCountdown(60, true);

            localStorage.setItem(this.RATE_LIMIT_KEY, JSON.stringify({
              blocked_until: new Date(Date.now() + 60000).toISOString(),
              remaining_seconds: 60
            }));

            this.handleRateLimitInfo(response);

            const emailSend = {
              type: "email_send",
              title: "Email Sent",
              message: "Your email has been sent successfully!"
            };

            const { title, message } = this.errorTranslationService.translateBackendError(emailSend);
            this.notificationService.success(title, message);

            this.isLoading = false;



            this.redirectTimeout = setTimeout(() => {
              this.router.navigate(['/auth/validate-code']);
            }, 1000);

          },
          error: (err) => {
            this.isLoading = false;

            // Verifica se é erro de rate limit (429)
            if (err.status === 429) {
              this.handleRateLimitError(err);
            } else {
              // Erro normal
              const { title, message } = this.errorTranslationService.translateBackendError(err);
              this.notificationService.error(title, message);
            }
          }
        });
      }
    } else if (this.isBlocked) {
      // Usuário tentou clicar enquanto bloqueado
      const minutes = Math.ceil(this.countdown / 60);

      this.notificationService.warning(
        this.translocoService.translate('domain.auth.pages.forgotPassword.rateLimitStillBlockedTitle'),
        this.translocoService.translate('domain.auth.pages.forgotPassword.rateLimitStillBlockedMessage', {
          minutes: minutes
        })
      );
    } else {
      // Formulário inválido
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  // Formata o tempo restante para exibição
  getFormattedTime(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);

    }
    clearTimeout(this.redirectTimeout);

  }
}