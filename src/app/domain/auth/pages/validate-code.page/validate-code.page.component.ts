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

  private fb = inject(NonNullableFormBuilder);

  constructor(
    private authService: AuthService,
    private notificationService: NzNotificationService,
    private translocoService: TranslocoService,
    private errorTranslationService: ErrorTranslationService,
    private router: Router

  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("recovery_email"))
      this.recoveryEmail = sessionStorage.getItem("recovery_email");
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

            // Remove cookie de fluxo
            this.removeRecoveryCookie();

            // Set cookie de stage validado
            document.cookie = "recovery_stage=validated; path=/; max-age=300; secure; samesite=none";

            const { title, message } = this.errorTranslationService.translateBackendError(response);
            this.notificationService.success(title, message);

            // Redireciona
            setTimeout(() => {
              this.router.navigate(['/auth/reset-password']);
            }, 50);
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


  private removeRecoveryCookie() {
    document.cookie = "recovery_flow=; path=/; max-age=0; secure; samesite=none";
  }

}
