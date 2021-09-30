import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrpolicyPage } from './hrpolicy.page';

describe('HrpolicyPage', () => {
  let component: HrpolicyPage;
  let fixture: ComponentFixture<HrpolicyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrpolicyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrpolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
