import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallresponsequestionsPage } from './callresponsequestions.page';

describe('CallresponsequestionsPage', () => {
  let component: CallresponsequestionsPage;
  let fixture: ComponentFixture<CallresponsequestionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallresponsequestionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallresponsequestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
