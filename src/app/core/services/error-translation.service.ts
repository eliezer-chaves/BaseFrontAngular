import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class ErrorTranslationService {
  
  private errorMap: { [key: string]: string } = {
    'unauthenticated': 'errors.notifications.unauthenticated',
    'server_error': 'errors.notifications.serverError',
    'invalid_credentials': 'errors.notifications.invalidCredentials',
    'user_not_found': 'errors.notifications.userNotFound',
    'account_locked': 'errors.notifications.accountLocked',
    'email_not_verified': 'errors.notifications.emailNotVerified',
    'validation_error': 'errors.notifications.validationError',
    'update_error': 'errors.notifications.updateError',
    'invalid_password': 'errors.notifications.invalidPassword'
  };

  constructor(private translocoService: TranslocoService) {}

  translateBackendError(error: any): { title: string, message: string } {
    let title = this.translocoService.translate('errors.notifications.loginErrorTitle');
    let message = '';

    if (error.type) {
      const errorKey = this.errorMap[error.type] || 'errors.notifications.genericError';
      message = this.translocoService.translate(errorKey);
      
      if (message === errorKey && error.message) {
        message = error.message;
      }
    } else {
      message = this.translocoService.translate('errors.notifications.genericError');
    }

    return { title, message };
  }
}