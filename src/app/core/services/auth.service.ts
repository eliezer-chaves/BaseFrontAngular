import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap, catchError, throwError, shareReplay, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { iUser, iUserRegister } from '../interfaces/iUser.interface';


@Injectable({ providedIn: 'root' })
export class AuthService {

	private API_URL = environment.apiUrl;

	// Armazena o estado do usuário logado
	private currentUserSubject = new BehaviorSubject<iUser | null>(null);
	public currentUser$ = this.currentUserSubject.asObservable();

	// Flag para controlar se a inicialização já foi feita
	private isInitialized = false;
	private initializationPromise: Observable<iUser | null> | null = null;

	constructor(
		private http: HttpClient,
		private router: Router,
	) { }

	// Cadastro de novo usuário
	register(data: iUserRegister): Observable<any> {
		const mapped = {
			usr_first_name: data.usr_first_name,
			usr_last_name: data.usr_last_name,
			usr_email: data.usr_email,
			usr_password: data.usr_password,
			usr_password_confirmation: data.usr_password_confirmation,
			usr_phone: data.usr_phone,
		};

		return this.http.post<any>(`${this.API_URL}/users/signup`, mapped, { withCredentials: true }).pipe(
			switchMap(() => this.getMe()),
			tap(response => {
				this.isInitialized = true;
				this.router.navigate(['/']);
			}),
			catchError(this.handleError)
		);
	}

	/**
	 * NOVO MÉTODO: Envia o id_token para o backend Laravel para autenticação OAuth.
	 * O backend se encarrega de criar ou logar o usuário.
	 * @param data Objeto contendo id_token (obrigatório) e usr_phone (opcional).
	 */
	registerOAuth(data: { id_token: string }): Observable<any> {
		return this.http.post<any>(`${this.API_URL}/registerOAuth`, data, { withCredentials: true }).pipe(
			switchMap((oauthResponse: any) => {
				// Assumimos que o sucesso do registerOAuth significa que o cookie JWT foi setado
				// Agora buscamos os dados do usuário para atualizar o estado local
				if (oauthResponse && oauthResponse.expires_in) {
					this.setAutoLogout(oauthResponse.expires_in);
				}
				return this.getMe();
			}),
			tap(() => {
				this.isInitialized = true;
				this.router.navigate(['/']); // Redireciona após sucesso e obtenção do 'me'
			}),
			catchError(this.handleError)
		);
	}

	// Login com CPF e senha
	login(usr_email: string, usr_password: string): Observable<any> {
		return this.http.post<any>(
			`${this.API_URL}/auth/login`,
			{ usr_email, usr_password },
			{ withCredentials: true }
		).pipe(
			switchMap((loginResponse: any) => {
				// Ativa o timer de logout usando o expires_in recebido do backend
				if (loginResponse && loginResponse.expires_in) {
					this.setAutoLogout(loginResponse.expires_in);
				}

				// Depois de logar, buscar dados do usuário
				return this.getMe();
			}),
			tap(() => {
				this.isInitialized = true;
				this.router.navigate(['/']);
			}),
			catchError(this.handleError)
		);
	}


	private logoutTimer: any = null;

	setAutoLogout(seconds: number) {
		if (this.logoutTimer) {
			clearTimeout(this.logoutTimer);
		}

		this.logoutTimer = setTimeout(() => {
			this.resetAuthState();
			this.router.navigate(['/']);
		}, seconds * 1000);
	}

	// Atualiza dados do usuário
	// updateUser(data: iUser): Observable<iUser> {
	// 	const mapped = {
	// 		usr_password: data.usr_password,
	// 		usr_first_name: data.usr_first_name,
	// 		usr_last_name: data.usr_last_name,
	// 		usr_email: data.usr_email,
	// 		usr_phone: data.usr_phone,
	// 	};

	// 	return this.http.put<iUser>(`${this.API_URL}/user`, mapped, { withCredentials: true }).pipe(
	// 		tap(user => {
	// 			this.currentUserSubject.next(user);
	// 		}),
	// 		catchError(this.handleError)
	// 	);
	// }

	// Método simplificado para buscar dados do usuário
	getMe(): Observable<iUser> {
		return this.http.get<iUser>(`${this.API_URL}/auth/me`, {
			withCredentials: true
		}).pipe(
			tap(user => this.currentUserSubject.next(user)),
			catchError(error => {
				if (error.status === 401) {
					this.currentUserSubject.next(null);
				}
				return this.handleError(error);
			})
		);
	}

	// Método para inicializar o estado de autenticação
	initializeAuthState(): Observable<iUser | null> {
		// Se já foi inicializado, retorna o estado atual
		if (this.isInitialized) {
			return of(this.currentUserSubject.value);
		}

		// Se já existe uma inicialização em progresso, retorna ela
		if (this.initializationPromise) {
			return this.initializationPromise;
		}

		// Cria uma nova inicialização
		this.initializationPromise = this.getMe().pipe(
			tap(() => this.isInitialized = true),
			catchError(() => {
				this.isInitialized = true;
				this.currentUserSubject.next(null);
				return of(null);
			}),
			shareReplay(1) // Compartilha o resultado entre múltiplas subscrições
		);

		return this.initializationPromise;
	}

	// Método para verificar se o usuário está autenticado (aguarda inicialização)
	isAuthenticated(): Observable<boolean> {
		return this.initializeAuthState().pipe(
			map(user => !!user)
		);
	}

	// Logout destrói o cookie no backend
	logout(): Observable<any> {
		return this.http.post(`${this.API_URL}/auth/logout`, {}, { withCredentials: true }).pipe(
			tap(() => this.performLogoutCleanup())
		);
	}

	private performLogoutCleanup(): void {
		// Desliga temporariamente a verificação automática
		this.isInitialized = false;

		// Limpa tudo da sessão
		this.clearSession();
		this.resetAuthState();

		// Evita /auth/me ser chamado no meio da navegação
		setTimeout(() => {
			this.router.navigate(['/auth']);
		}, 0);
	}


	resetAuthState(): void {
		this.currentUserSubject.next(null);
		if (this.logoutTimer) {
			clearTimeout(this.logoutTimer);
			this.logoutTimer = null;
		}
	}


	private clearSession() {
		this.currentUserSubject.next(null);


		this.isInitialized = false;
		this.initializationPromise = null;
	}

	// Método síncrono para verificar se há usuário em cache
	isLoggedIn(): boolean {
		return !!this.currentUserSubject.value;
	}

	// Tratamento de erros estruturado
	private handleError(error: any) {
		if (error.error?.error_type) {
			return throwError(() => ({
				type: error.error.error_type,
				title: error.error.error_title,
				message: error.error.error_message
			}));
		}

		return throwError(() => ({
			type: 'unexpected_error',
			title: 'Erro inesperado',
			message: 'Erro no servidor. Tente novamente mais tarde.'
		}));
	}
}