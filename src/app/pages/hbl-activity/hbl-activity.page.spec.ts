import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblActivityPage } from './hbl-activity.page';

describe('HblActivityPage', () => {
  let component: HblActivityPage;
  let fixture: ComponentFixture<HblActivityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblActivityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
