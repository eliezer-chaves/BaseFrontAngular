import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })


export class ErrorTranslationService {

  // Mapeamento dos tipos de erro para chaves de tradução
  private errorTypeMap: { [key: string]: string } = {
    'email_already_registered': 'errors.types.emailAlreadyRegistered.type',
    'internal_server_error': 'errors.types.internalServerError.type',
    'invalid_credentials': 'errors.types.invalidCredentials.type',
    "missing_credentials": 'errors.types.missingCredentials.type',
    "user_not_found": 'errors.types.userNotFound.type',
    "phone_already_registered": 'errors.types.phoneAlreadyRegistered.type',
    'no_connection_api': 'errors.types.noConnectionApi.type'


  };

  private errorTitleMap: { [key: string]: string } = {
    'email_already_registered': 'errors.types.emailAlreadyRegistered.title',
    'internal_server_error': 'errors.types.internalServerError.title',
    'invalid_credentials': 'errors.types.invalidCredentials.title',
    "missing_credentials": 'errors.types.missingCredentials.title',
    "phone_already_registered": 'errors.types.phoneAlreadyRegistered.title',
    'no_connection_api': 'errors.types.noConnectionApi.title'




  };

  private errorMessageMap: { [key: string]: string } = {
    'email_already_registered': 'errors.types.emailAlreadyRegistered.message',
    'internal_server_error': 'errors.types.internalServerError.message',
    'invalid_credentials': 'errors.types.invalidCredentials.message',
    "missing_credentials": 'errors.types.missingCredentials.message',
    "phone_already_registered": 'errors.types.phoneAlreadyRegistered.message',
    'no_connection_api': 'errors.types.noConnectionApi.message'



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
      title: error?.title,
      message: error?.message
    };
  }

}