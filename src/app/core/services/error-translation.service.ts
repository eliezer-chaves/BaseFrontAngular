import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })


export class ErrorTranslationService {

  // Mapeamento dos tipos de erro para chaves de tradução
  private errorTypeMap: { [key: string]: string } = {
    'email_already_registered': 'errors.types.emailAlreadyRegistered.type',

  };

  private errorTitleMap: { [key: string]: string } = {
    'email_already_registered': 'errors.types.emailAlreadyRegistered.title',

  };

  private errorMessageMap: { [key: string]: string } = {
    'email_already_registered': 'errors.types.emailAlreadyRegistered.message',

  };



  constructor(private translocoService: TranslocoService) { }

  translateBackendError(error: any): { title: string, message: string } {
    const type = error?.type;

    // Se o tipo existir no mapa, pegamos as chaves de tradução
    const titleKey = this.errorTitleMap[type];
    const messageKey = this.errorMessageMap[type];

    // Se achou o type no map → traduz normalmente
    if (titleKey && messageKey) {
      return {
        title: this.translocoService.translate(titleKey),
        message: this.translocoService.translate(messageKey)
      };
    }

    // Caso não exista no mapa → fallback usando próprio backend
    return {
      title: error?.title || this.translocoService.translate('errors.notifications.genericErrorTitle'),
      message: error?.message || this.translocoService.translate('errors.notifications.genericError')
    };
  }

}