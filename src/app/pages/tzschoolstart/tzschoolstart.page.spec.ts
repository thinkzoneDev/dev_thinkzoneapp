import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TzschoolstartPage } from './tzschoolstart.page';

describe('TzschoolstartPage', () => {
  let component: TzschoolstartPage;
  let fixture: ComponentFixture<TzschoolstartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TzschoolstartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TzschoolstartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
