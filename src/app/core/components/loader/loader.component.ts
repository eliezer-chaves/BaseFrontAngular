// loader.component.ts
import { Component } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import {  TranslocoModule } from "@jsverse/transloco";

@Component({
  selector: 'app-loader',
  imports: [NzSpinModule, TranslocoModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {}