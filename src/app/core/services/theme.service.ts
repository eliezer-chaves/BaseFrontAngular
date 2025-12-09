// src/app/core/services/theme.service.ts
import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'app-theme';
  
  // tema atual
  theme = signal<ThemeMode>('light');
  
  // controla visibilidade do loader
  isLoadingTheme = signal<boolean>(false);

  constructor() {
    this.initializeTheme();
  }

  /** Inicializa o tema com base em: localStorage > preferência do sistema > default */
  private initializeTheme() {
    const savedTheme = this.getStoredTheme();
    const systemTheme = this.getSystemTheme();
    
    // Prioridade: tema salvo > tema do sistema > default
    const initialTheme = savedTheme || systemTheme;
    
    this.theme.set(initialTheme);
    this.applyTheme(initialTheme, false); // sem loader na inicialização
  }

  /** Obtém o tema salvo no localStorage */
  private getStoredTheme(): ThemeMode | null {
    try {
      const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored as ThemeMode;
      }
    } catch (error) {
      console.warn('Erro ao ler tema do localStorage:', error);
    }
    return null;
  }

  /** Detecta a preferência de tema do sistema operacional */
  private getSystemTheme(): ThemeMode {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  }

  /** Salva o tema no localStorage */
  private saveTheme(theme: ThemeMode) {
    try {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Erro ao salvar tema no localStorage:', error);
    }
  }

  /** Alterna entre Light e Dark */
  toggleTheme() {
    const newTheme: ThemeMode = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    this.applyTheme(newTheme, true); // com loader
    this.saveTheme(newTheme);
  }

  /** Aplica o tema usando apenas CSS Variables (sem bundles separados) */
  private applyTheme(theme: ThemeMode, showLoader: boolean = true) {
    if (showLoader) {
      this.isLoadingTheme.set(true);
    }

    // Atualiza a classe no elemento HTML
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);

    // Simula um delay mínimo para o loader (opcional, para UX)
    if (showLoader) {
      setTimeout(() => {
        this.isLoadingTheme.set(false);
      }, 300);
    }
  }

  /** Monitora mudanças na preferência do sistema (opcional) */
  watchSystemTheme() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Só aplica se não houver tema salvo pelo usuário
        if (!this.getStoredTheme()) {
          const newTheme: ThemeMode = e.matches ? 'dark' : 'light';
          this.theme.set(newTheme);
          this.applyTheme(newTheme, false);
        }
      });
    }
  }

  /** Limpa o tema salvo e volta para a preferência do sistema */
  resetToSystemTheme() {
    try {
      localStorage.removeItem(this.THEME_STORAGE_KEY);
      const systemTheme = this.getSystemTheme();
      this.theme.set(systemTheme);
      this.applyTheme(systemTheme, true);
    } catch (error) {
      console.warn('Erro ao resetar tema:', error);
    }
  }
}