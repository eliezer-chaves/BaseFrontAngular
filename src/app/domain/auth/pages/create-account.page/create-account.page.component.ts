import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NonNullableFormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
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
import { AuthService } from '../../../../core/services/auth.service';
import { iUserRegister } from '../../../../core/interfaces/iUser.interface';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { ButtonLanguageComponent } from '../../../../core/components/button-language/button-language.component';
import { ButtonThemeComponent } from '../../../../core/components/button-theme/button-theme.component';
import { IntlTelInputComponent } from "intl-tel-input/angularWithUtils";
import { map, merge, Observable, of, startWith, switchMap, timer } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { passwordStrengthValidator } from "../../../../core/functions/password-strength.validator"
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ErrorTranslationService } from '../../../../core/services/error-translation.service';

declare const google: any;


@Component({
	selector: 'app-create-account.page',
	standalone: true,
	imports: [
		RouterLink,
		ReactiveFormsModule,
		FormsModule,
		AsyncPipe,
		NzFormModule,
		NzInputModule,
		NzSelectModule,
		NzGridModule,
		NzDatePickerModule,
		NzRadioModule,
		NzCheckboxModule,
		NzButtonModule,
		NzIconModule,
		NzInputNumberModule,
		NzTypographyModule,
		NzFlexModule,
		TranslocoModule,
		NzDividerComponent,
		ButtonLanguageComponent,
		ButtonThemeComponent,
		IntlTelInputComponent
	],
	templateUrl: './create-account.page.component.html',
	styleUrl: './create-account.page.component.css'
})
export class CreateAccountPageComponent implements OnInit {
	@ViewChild('telInput') telInput!: IntlTelInputComponent;
	minLenghtPassword: number = environment.passwordMinLenght

	loadingService = inject(LoadingService);
	private translocoService = inject(TranslocoService);
	isLoading = false;
	private fb = inject(NonNullableFormBuilder);

	// Variáveis para controlar a visibilidade da senha e estado de digitação
	passwordVisible = false;
	confirmPasswordVisible = false;
	hasTyped = false;

	validateForm = this.fb.group({
		usr_first_name: this.fb.control('', [Validators.required]),
		usr_last_name: this.fb.control('', [Validators.required]),
		usr_phone: this.fb.control('', [Validators.required, this.phoneValidator.bind(this)]),
		usr_email: this.fb.control('', [Validators.required, Validators.email]),
		usr_password: this.fb.control('', [
			Validators.required,
			Validators.minLength(environment.passwordMinLenght),
			passwordStrengthValidator() // Adicione o validador aqui
		]),
		usr_password_confirmation: this.fb.control('', [Validators.required, this.passwordMatchValidator.bind(this)])
	});

	phoneNumber: string = '';
	isPhoneValid: boolean = false;

	public telInputOptions$!: Observable<any>;

	constructor(private authService: AuthService, private notificationService: NzNotificationService,
		private errorTranslationService: ErrorTranslationService,

	) { }

	ngOnInit() {
		this.telInputOptions$ = this.translocoService.langChanges$.pipe(
			startWith(this.translocoService.getActiveLang()),
			switchMap(() => {
				return merge(
					of(null),
					timer(100).pipe(
						switchMap(() =>
							this.translocoService.selectTranslateObject('domain.auth.components.phoneInput')
						)
					)
				);
			}),
			map((translations) => {
				if (!translations) return null;

				return {
					initialCountry: 'br',
					strictMode: true,
					formatAsYouType: true,
					showFlags: true,
					separateDialCode: true,
					placeholderNumberType: 'MOBILE',
					autoPlaceholder: 'aggressive',
					containerClass: 'intl-tel-input-container',
					countryOrder: ['br', 'us'],
					useFullscreenPopup: false,
					dropdownContainer: null,
					i18n: translations
				};
			})
		);
	}

	// Método para rastrear quando o usuário começa a digitar a senha
	onPasswordInput() {
		const passwordControl = this.validateForm.get('usr_password');
		this.hasTyped = !!passwordControl?.value && passwordControl.value.length > 0;
	}

	// Validador SÍNCRONO para telefone
	phoneValidator(control: AbstractControl): ValidationErrors | null {
		const value = control.value;

		if (!value || value.trim() === '') {
			return null;
		}

		// Verifica se o telefone é válido
		if (!this.isPhoneValid) {
			return { invalidPhone: true };
		}

		return null;
	}

	// Validador para confirmar senha
	passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
		const password = this.validateForm?.get('usr_password')?.value;
		const confirmPassword = control.value;

		if (password && confirmPassword && password !== confirmPassword) {
			return { passwordMismatch: true };
		}

		return null;
	}

	// Getter para mostrar erro do telefone
	get phoneErrorMessage(): string {
		const control = this.validateForm.get('usr_phone');

		if (!control || !control.touched || !control.errors) {
			return '';
		}

		if (control.errors['required']) {
			return this.translocoService.translate('domain.auth.pages.createAccount.errorPhone');
		}

		if (control.errors['invalidPhone']) {
			return this.translocoService.translate('domain.auth.pages.createAccount.errorPhoneInvalid');
		}

		return '';
	}

	// Getter para saber se deve mostrar erro
	get showPhoneError(): boolean {
		const control = this.validateForm.get('usr_phone');
		return !!(control && control.touched && control.invalid);
	}

	// Getter para verificar erros específicos da senha (para o template)
	get passwordErrors() {
		const passwordControl = this.validateForm.get('usr_password');
		return {
			hasUppercaseError: passwordControl?.hasError('uppercaseRequired'),
			hasLowercaseError: passwordControl?.hasError('lowercaseRequired'),
			hasMinLengthError: passwordControl?.hasError('minLength'),
			hasSpecialCharError: passwordControl?.hasError('specialCharRequired'),
			hasCommonSequenceError: passwordControl?.hasError('commonSequence')
		};
	}

	handleNumberChange(event: any) {
		this.phoneNumber = event;

		const control = this.validateForm.get('usr_phone');
		if (control) {
			control.setValue(event, { emitEvent: false });
			control.markAsTouched();
			setTimeout(() => control.updateValueAndValidity(), 50);
		}
	}

	handleValidityChange(isValid: boolean) {
		this.isPhoneValid = isValid;

		const control = this.validateForm.get('usr_phone');
		if (control && control.touched) {
			setTimeout(() => control.updateValueAndValidity(), 50);
		}
	}

	handleCountryChange(event: any) {
		const control = this.validateForm.get('usr_phone');
		if (control) {
			setTimeout(() => control.updateValueAndValidity(), 50);
		}
	}

	onPhoneBlur() {
		const control = this.validateForm.get('usr_phone');
		if (control) {
			control.markAsTouched();
			control.updateValueAndValidity();
		}
	}

	submitForm() {
		// Marca todos os campos como touched
		Object.keys(this.validateForm.controls).forEach(key => {
			const control = this.validateForm.get(key);
			control?.markAsTouched();
			control?.updateValueAndValidity();
		});

		if (this.validateForm.valid) {
			this.isLoading = true;

			const formData = {
				...this.validateForm.value,
				usr_phone: this.phoneNumber
			};

			this.authService.register(formData as iUserRegister).subscribe({
				next: () => {
					this.isLoading = false;
				},
				error: (err) => {
					
					const { title, message } = this.errorTranslationService.translateBackendError(err);

					this.notificationService.error(title, message);
					this.isLoading = false;
				}
			});
		}
	}

	// NOVO MÉTODO: Lógica para enviar o token OAuth para o backend
	registerOAuth(idToken: string, usr_phone: string | null) {
		this.isLoading = true;

		const body = {
			id_token: idToken,

		};

		this.authService.registerOAuth(body).subscribe({
			next: () => {
				this.isLoading = false;
				// O serviço de autenticação (AuthService) se encarrega do redirecionamento
			},
			error: (err) => {
				const { title, message } = this.errorTranslationService.translateBackendError(err);
				this.notificationService.error(title, message);
				this.isLoading = false;
			}
		});
	}

	// NOVO MÉTODO: Recebe o token do Google e inicia o fluxo de registro/login
	handleCredentialResponse(response: any) {
		const idToken = response.credential;

		if (idToken) {
			const phone = this.phoneNumber || null; // Pega o telefone do campo (se preenchido)
			this.registerOAuth(idToken, phone);
		} else {
			this.notificationService.error(
				this.translocoService.translate('domain.auth.pages.createAccount.errorOAuthTitle'),
				this.translocoService.translate('domain.auth.pages.createAccount.errorOAuthMessage')
			);
		}
	}

	// MÉTODO CORRIGIDO: Configuração do GSI para o modo Client-Driven
	// ngAfterViewInit(): void {
	// 	setTimeout(() => {
	// 		if (typeof google !== 'undefined' && google.accounts?.id) {
	// 			google.accounts.id.initialize({
	// 				client_id: "776175008574-7uveb1rst7tr3d66sa1sftjnqgdafkmr.apps.googleusercontent.com",
	// 				// CORREÇÃO: Usar 'popup' e 'callback' para forçar o Angular a fazer o POST
	// 				ux_mode: "popup", 
	// 				context: "signup",
	// 				callback: this.handleCredentialResponse.bind(this),
	// 				// REMOVIDA A PROPRIEDADE login_uri
	// 			});

	// 			google.accounts.id.renderButton(
	// 				document.getElementById("g_id_signin_button"),
	// 				{ theme: "outline", size: "large", type: "standard", shape: "rectangular" }
	// 			);
	// 		}
	// 	}, 200);
	// }
}