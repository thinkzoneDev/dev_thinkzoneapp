import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInstructionsPgePage } from './general-instructions-pge.page';

describe('GeneralInstructionsPgePage', () => {
  let component: GeneralInstructionsPgePage;
  let fixture: ComponentFixture<GeneralInstructionsPgePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralInstructionsPgePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInstructionsPgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
