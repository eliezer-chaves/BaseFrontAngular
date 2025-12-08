import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLanguageComponent } from './button-language.component';

describe('ButtonLanguageComponent', () => {
  let component: ButtonLanguageComponent;
  let fixture: ComponentFixture<ButtonLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonLanguageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
