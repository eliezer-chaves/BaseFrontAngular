import { Component, inject } from '@angular/core';
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
export class ForgotPasswordPageComponent {
  loadingService = inject(LoadingService);
  isLoading = false;
  minLenghtPassword: number = environment.passwordMinLenght


  private fb = inject(NonNullableFormBuilder);
  constructor(
    private authService: AuthService,
    private notificationService: NzNotificationService,
    private translocoService: TranslocoService,
    private errorTranslationService: ErrorTranslationService,
    private router: Router

  ) { }

  validateForm = this.fb.group({
    usr_email: this.fb.control('', [Validators.required, Validators.email]),
  });

  submitForm() {
    if (this.validateForm.valid) {
      this.isLoading = true;

      const { usr_email } = this.validateForm.value;
      if (usr_email) {
        this.authService.sendEmailCode(usr_email).subscribe({
          next: () => {
            //console.log('Login realizado com sucesso');
            this.isLoading = false;
            // Email existente → continuar fluxo
            localStorage.setItem('reset_email', usr_email);
            console.log(usr_email)
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

}
