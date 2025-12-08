import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonLanguageComponent } from '../../components/button-language/button-language.component';
import { ButtonThemeComponent } from "../../components/button-theme/button-theme.component";

@Component({
  selector: 'app-auth.layout',
  imports: [RouterModule],
  templateUrl: './auth.layout.component.html',
  styleUrl: './auth.layout.component.css'
})
export class AuthLayoutComponent {

}
