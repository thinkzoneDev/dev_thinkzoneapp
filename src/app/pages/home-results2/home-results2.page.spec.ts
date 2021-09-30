import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResults2Page } from './home-results2.page';

describe('HomeResults2Page', () => {
  let component: HomeResults2Page;
  let fixture: ComponentFixture<HomeResults2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeResults2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeResults2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
