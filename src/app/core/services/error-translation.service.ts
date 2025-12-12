import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })


export class ErrorTranslationService {

  // Mapeamento dos tipos de erro para chaves de tradução
  private TypeMap: { [key: string]: string } = {
    'email_already_registered': 'errors.types.emailAlreadyRegistered.type',
    'internal_server_error': 'errors.types.internalServerError.type',
    'invalid_credentials': 'errors.types.invalidCredentials.type',
    "missing_credentials": 'errors.types.missingCredentials.type',
    "user_not_found": 'errors.types.userNotFound.type',
    "phone_already_registered": 'errors.types.phoneAlreadyRegistered.type',
    "no_connection_api": "errors.types.noConnectionApi.type",
    "password_reset_email_sent": "success.types.passwordResetEmailSent.type",
    "email_code_sent": "success.types.emailCodeSent.type",
    "email_send": "success.types.emailSend.type",
    "rate_limit_exceeded": "domain.auth.pages.forgotPassword.type"


  };

  private TitleMap: { [key: string]: string } = {
    'email_already_registered': 'errors.types.emailAlreadyRegistered.title',
    'internal_server_error': 'errors.types.internalServerError.title',
    'invalid_credentials': 'errors.types.invalidCredentials.title',
    "missing_credentials": 'errors.types.missingCredentials.title',
    "user_not_found": 'errors.types.userNotFound.title',
    "phone_already_registered": 'errors.types.phoneAlreadyRegistered.title',
    "no_connection_api": "errors.types.noConnectionApi.title",
    "password_reset_email_sent": "success.types.passwordResetEmailSent.title",
    "email_code_sent": "success.types.emailCodeSent.title",
    "email_send": "success.types.emailSend.title",
    "rate_limit_exceeded": "domain.auth.pages.forgotPassword.rateLimitBlockedTitle"


  };

  private MessageMap: { [key: string]: string } = {
    'email_already_registered': 'errors.types.emailAlreadyRegistered.message',
    'internal_server_error': 'errors.types.internalServerError.message',
    'invalid_credentials': 'errors.types.invalidCredentials.message',
    "missing_credentials": 'errors.types.missingCredentials.message',
    "user_not_found": 'errors.types.userNotFound.message',
    "phone_already_registered": 'errors.types.phoneAlreadyRegistered.message',
    'no_connection_api': 'errors.types.noConnectionApi.message',
    "password_reset_email_sent": "success.types.passwordResetEmailSent.message",
    "email_code_sent": "success.types.emailCodeSent.message",
    "email_send": "success.types.emailSend.message",
    "rate_limit_exceeded": "domain.auth.pages.forgotPassword.rateLimitBlockedMessage"



  };



  constructor(private translocoService: TranslocoService) { }
  translateBackendError(error: any): { title: string, message: string } {
    const backendError = error?.error?.detail || error?.error || error;
    const type = backendError?.type;

    const titleKey = this.TitleMap[type];
    const messageKey = this.MessageMap[type];

    // Caso especial: RATE LIMIT precisa de parâmetros
    if (type === 'rate_limit_exceeded') {
      const remainingSeconds = backendError.remaining_seconds ?? 0;
      const minutes = Math.ceil(remainingSeconds / 60);

      return {
        title: this.translocoService.translate(titleKey),
        message: this.translocoService.translate(messageKey, {
          minutes: minutes
        })
      };
    }

    // Normal
    if (titleKey && messageKey) {
      return {
        title: this.translocoService.translate(titleKey),
        message: this.translocoService.translate(messageKey)
      };
    }

    return {
      title: backendError?.title || 'Erro',
      message: backendError?.message || 'Ocorreu um erro inesperado.'
    };
  }


}