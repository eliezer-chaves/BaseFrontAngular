import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonLanguageComponent } from "../../components/button-language/button-language.component";
import { ButtonThemeComponent } from "../../components/button-theme/button-theme.component";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-dashboard.layout',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './dashboard.layout.component.html',
  styleUrl: './dashboard.layout.component.css'
})
export class DashboardLayoutComponent {

}
