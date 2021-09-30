import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblRegisterPage } from './hbl-register.page';

describe('HblRegisterPage', () => {
  let component: HblRegisterPage;
  let fixture: ComponentFixture<HblRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblRegisterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
