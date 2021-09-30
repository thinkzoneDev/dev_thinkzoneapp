import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInstructionsPage } from './general-instructions.page';

describe('GeneralInstructionsPage', () => {
  let component: GeneralInstructionsPage;
  let fixture: ComponentFixture<GeneralInstructionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralInstructionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInstructionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
