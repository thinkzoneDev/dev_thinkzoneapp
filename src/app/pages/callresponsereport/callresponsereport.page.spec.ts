import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallresponsereportPage } from './callresponsereport.page';

describe('CallresponsereportPage', () => {
  let component: CallresponsereportPage;
  let fixture: ComponentFixture<CallresponsereportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallresponsereportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallresponsereportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
