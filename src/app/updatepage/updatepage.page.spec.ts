import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepagePage } from './updatepage.page';

describe('UpdatepagePage', () => {
  let component: UpdatepagePage;
  let fixture: ComponentFixture<UpdatepagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatepagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatepagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
