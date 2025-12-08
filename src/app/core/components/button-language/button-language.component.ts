import { Component, OnInit } from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LanguageConfig } from '../../../environments/environment';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-button-language',
  imports: [NzDropDownModule, NzIconModule],
  templateUrl: './button-language.component.html',
  styleUrl: './button-language.component.css',
})
export class ButtonLanguageComponent implements OnInit {
  defaultLang: string = 'en';
  languages: LanguageConfig[] = [];

  constructor(private translateService: TranslateService) {}

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
}