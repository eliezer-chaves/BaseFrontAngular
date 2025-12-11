import { LanguageConfig as ILanguageConfig } from "../core/interfaces/iLanguageConfig";

export const environment = {
  production: false, 
  passwordMinLenght: 8,
  apiUrl: 'https://127.0.0.1:8000',

  languages: [
    { code: 'en', name: 'English', countryCode: 'gb' },
    { code: 'pt-BR', name: 'Português (BR)', countryCode: 'br' },
    // { code: 'de', name: 'Deutsch', countryCode: 'de' },
    // { code: 'es', name: 'Español', countryCode: 'es' },
    // { code: 'fr', name: 'Français', countryCode: 'fr' },
    // { code: 'it', name: 'Italiano', countryCode: 'it' },
    // { code: 'pt-PT', name: 'Português (PT)', countryCode: 'pt' },
  ] as ILanguageConfig[],

  get availableLanguageMap(): { [key: string]: string } {
    return this.languages.reduce((acc, lang) => {
      acc[lang.code] = lang.name;
      return acc;
    }, {} as { [key: string]: string });
  },

  get availableLanguages(): string[] {
    return this.languages.map(lang => lang.code);
  }
};

// ADICIONE esta linha para re-exportar como LanguageConfig
export type LanguageConfig = ILanguageConfig;