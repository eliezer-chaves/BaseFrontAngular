import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { LoadingService } from '../../../../shared/services/loading.service';
import { iUserLogin, iUserRegister } from '../../../../core/interfaces/iUser.interface';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ErrorTranslationService } from '../../../../core/services/error-translation.service';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { ButtonLanguageComponent } from "../../../../core/components/button-language/button-language.component";
import { ButtonThemeComponent } from "../../../../core/components/button-theme/button-theme.component";
import { environment } from '../../../../environments/environment';

declare const google: any;


@Component({
  selector: 'app-login.page',
  imports: [RouterLink, ReactiveFormsModule, FormsModule, NzFormModule, NzSelectModule, NzGridModule, NzDatePickerModule, NzRadioModule, NzInputModule, NzCheckboxModule, NzButtonModule, NzIconModule, NzInputNumberModule, NzTypographyModule, NzFlexModule, TranslocoModule, NzDividerComponent, ButtonLanguageComponent, ButtonThemeComponent],
  templateUrl: './login.page.component.html',
  styleUrl: './login.page.component.css',
})

export class LoginPageComponent {
  loadingService = inject(LoadingService);
  isLoading = false;
    minLenghtPassword: number = environment.passwordMinLenght
  

  private fb = inject(NonNullableFormBuilder);
  constructor(
    private authService: AuthService,
    private notificationService: NzNotificationService,
    private translocoService: TranslocoService,
    private errorTranslationService: ErrorTranslationService,

  ) { }

  validateForm = this.fb.group({
    usr_email: this.fb.control('', [Validators.required, Validators.email]),
    usr_password: this.fb.control('', [Validators.required, Validators.required,
			Validators.minLength(environment.passwordMinLenght)])
  }); 

  submitForm() {
    if (this.validateForm.valid) {
      this.isLoading = true;

      const { usr_email, usr_password } = this.validateForm.value;
      if (usr_email && usr_password) {
        this.authService.login(usr_email, usr_password).subscribe({
          next: () => {
            //console.log('Login realizado com sucesso');
            this.isLoading = false;
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

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     if (typeof google !== 'undefined' && google.accounts?.id) {
  //       google.accounts.id.initialize({
  //         client_id: "776175008574-7uveb1rst7tr3d66sa1sftjnqgdafkmr.apps.googleusercontent.com",
  //         ux_mode: "redirect",
  //         context: "signup",
  //         login_uri: "http://localhost:4200/dashboard",
  //       });

  //       google.accounts.id.renderButton(
  //         document.getElementById("g_id_signin_button"),
  //         { theme: "outline", size: "large", type: "standard", shape: "rectangular" }
  //       );
  //     }
  //   }, 200);
  // }
}
