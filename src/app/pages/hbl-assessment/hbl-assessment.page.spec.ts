import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblAssessmentPage } from './hbl-assessment.page';

describe('HblAssessmentPage', () => {
  let component: HblAssessmentPage;
  let fixture: ComponentFixture<HblAssessmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblAssessmentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblAssessmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
