import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Statusmodal1Page } from './statusmodal1.page';

describe('Statusmodal1Page', () => {
  let component: Statusmodal1Page;
  let fixture: ComponentFixture<Statusmodal1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Statusmodal1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Statusmodal1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
