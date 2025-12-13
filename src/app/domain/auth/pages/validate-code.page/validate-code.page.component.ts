import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzInputOtpComponent } from 'ng-zorro-antd/input';
import { NzTypographyComponent } from "ng-zorro-antd/typography";
import { environment } from '../../../../environments/environment';
import { LoadingService } from '../../../../shared/services/loading.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormControlComponent, NzFormItemComponent, NzFormModule } from 'ng-zorro-antd/form';
import { ButtonLanguageComponent } from '../../../../core/components/button-language/button-language.component';
import { ButtonThemeComponent } from '../../../../core/components/button-theme/button-theme.component';
import { AuthService } from '../../../../core/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ErrorTranslationService } from '../../../../core/services/error-translation.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterLink } from '@angular/router';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-validate-code.page',
  imports: [RouterLink, NzFlexModule, NzInputOtpComponent, TranslocoModule, ɵInternalFormsSharedModule, NzButtonModule, NzFormControlComponent, NzFormItemComponent, FormsModule, ButtonLanguageComponent, ButtonThemeComponent, ReactiveFormsModule, FormsModule, NzFormModule, NzIconModule],
  templateUrl: './validate-code.page.component.html',
  styleUrl: './validate-code.page.component.css',
})
export class ValidateCodePageComponent implements OnInit {
  loadingService = inject(LoadingService);
  isLoading = false;

  recoveryEmail: string | null = null;
  expiresAt: any = null;
  remainingTime = '';
  private timerId: any;

  private fb = inject(NonNullableFormBuilder);

  constructor(
    private authService: AuthService,
    private notificationService: NzNotificationService,
    private translocoService: TranslocoService,
    private errorTranslationService: ErrorTranslationService,
    private router: Router,
    private emailService: EmailService

  ) { }

  ngOnInit(): void {
    if (this.emailService.getEmail()) {
      this.recoveryEmail = this.emailService.getEmail()
      this.expiresAt = this.emailService.getExpiresAt()

      const expiresAt = new Date(this.expiresAt);
      this.startCountdown(expiresAt);
    }

  }
  startCountdown(expiresAt: Date) {
    const update = () => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        this.remainingTime = '00:00';
        clearInterval(this.timerId);
        this.router.navigate(['/auth/forgot-password']);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      this.remainingTime = `${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // 🔥 executa imediatamente
    update();

    // ⏱ depois continua a cada segundo
    this.timerId = setInterval(update, 1000);
  }

  validateForm = this.fb.group({
    code: this.fb.control('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^\d+$/) // só números
    ]),
  });

  blockNonNumeric(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab'
    ];

    // teclas de controle continuam funcionando normalmente
    if (allowedKeys.includes(event.key)) return;

    // se NÃO for número → cancela e NÃO avança
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }


  //Validete Code
  submitForm() {
    if (this.validateForm.valid) {
      this.isLoading = true;

      const code = this.validateForm.get('code')?.value;

      if (code) {
        this.authService.sendCodeToValidation(code).subscribe({
          next: (response) => {
            this.isLoading = false;

            const { title, message } = this.errorTranslationService.translateBackendError(response);
            this.notificationService.success(title, message);


            this.router.navigate(['/auth/reset-password']);

          },
          error: (err) => {
            this.isLoading = false;

            // Mantém o cookie, porque o usuário ainda não validou o código
            const { title, message } = this.errorTranslationService.translateBackendError(err);
            this.notificationService.error(title, message);
          }
        });
      }
    }
  }




}
