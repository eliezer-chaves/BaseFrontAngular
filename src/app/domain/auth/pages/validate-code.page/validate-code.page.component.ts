import { Component } from '@angular/core';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzInputOtpComponent } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-validate-code.page',
  imports: [NzFlexModule, NzInputOtpComponent],
  templateUrl: './validate-code.page.component.html',
  styleUrl: './validate-code.page.component.css',
})
export class ValidateCodePageComponent {

}
