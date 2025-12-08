import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { environment, LanguageConfig } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private readonly STORAGE_KEY = 'user_preferred_language';
  private translocoService = inject(TranslocoService);
  
  languages: LanguageConfig[] = environment.languages;

  constructor() {
    this.initializeLanguage();
  }

  /**
   * Inicializa o idioma do localStorage ou usa o padrão
   */
  private initializeLanguage(): void {
    const storedLang = this.getStoredLanguage();
    if (storedLang && this.isValidLanguage(storedLang)) {
      this.translocoService.setActiveLang(storedLang);
    }
  }

  /**
   * Obtém o idioma armazenado no localStorage
   */
  private getStoredLanguage(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Armazena o idioma no localStorage
   */
  private storeLanguage(langCode: string): void {
    localStorage.setItem(this.STORAGE_KEY, langCode);
  }

  /**
   * Verifica se o código do idioma é válido
   */
  private isValidLanguage(langCode: string): boolean {
    return this.languages.some(lang => lang.code === langCode);
  }

  /**
   * Obtém o idioma ativo atual
   */
  getActiveLang(): string {
    return this.translocoService.getActiveLang();
  }

  /**
   * Altera o idioma e armazena no localStorage
   */
  changeLanguage(langCode: string): void {
    if (this.isValidLanguage(langCode)) {
      this.translocoService.setActiveLang(langCode);
      this.storeLanguage(langCode);
    }
  }

  /**
   * Obtém o código do país baseado no código do idioma
   */
  getCountryCode(langCode: string): string {
    const language = this.languages.find(lang => lang.code === langCode);
    return language ? language.countryCode : langCode.toLowerCase();
  }

  /**
   * Obtém o idioma atual completo (objeto LanguageConfig)
   */
  getCurrentLanguage(): LanguageConfig | undefined {
    const activeLang = this.getActiveLang();
    return this.languages.find(lang => lang.code === activeLang);
  }

  /**
   * Obtém a lista de idiomas disponíveis
   */
  getAvailableLanguages(): LanguageConfig[] {
    return this.languages;
  }

  /**
   * Remove o idioma armazenado do localStorage
   */
  clearStoredLanguage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}