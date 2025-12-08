// button-theme.component.ts
import { Component, computed } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { FormsModule } from "@angular/forms";
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-button-theme',
  imports: [NzButtonModule, NzIconModule, NzSpinModule, NzSwitchComponent, FormsModule, TranslocoModule],
  templateUrl: './button-theme.component.html',
  styleUrl: './button-theme.component.css',
})
export class ButtonThemeComponent {
  isDark = computed(() => this.themeService.theme() === 'dark');
  isLoading = computed(() => this.themeService.isLoadingTheme());



  constructor(private themeService: ThemeService) { }

  onToggle() {
    this.themeService.toggleTheme();
  }
}