import { Component, computed, OnInit } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonThemeComponent } from "../button-theme/button-theme.component";
import { ButtonLanguageComponent } from "../button-language/button-language.component";
import { NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { environment, LanguageConfig } from '../../../environments/environment';
import { ThemeService } from '../../services/theme.service';
import { TranslateService } from '../../services/translate.service';
import { NzSpinComponent } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-header',
  imports: [TranslocoModule,  NzDropDownModule, NzAvatarComponent, NzDropdownMenuComponent, NzIconModule, AsyncPipe, NzSpinComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  environment = environment;
  $user;
  isLoading = false;

  defaultLang: string = 'en';
  languages: LanguageConfig[] = [];
  isDark = computed(() => this.themeService.theme() === 'dark');

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private translateService: TranslateService
  ) {
    this.$user = this.authService.currentUser$;
  }

  ngOnInit() {
    this.defaultLang = this.translateService.getActiveLang();
    this.languages = this.translateService.getAvailableLanguages();
  }

  changeLanguage(langCode: string) {
    this.translateService.changeLanguage(langCode);
    this.defaultLang = langCode;
  }

  getCountryCode(langCode: string): string {
    return this.translateService.getCountryCode(langCode);
  }

  getCurrentLanguage(): LanguageConfig | undefined {
    return this.translateService.getCurrentLanguage();
  }
  
  onToggle() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.isLoading = true;

    this.authService.logout().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}