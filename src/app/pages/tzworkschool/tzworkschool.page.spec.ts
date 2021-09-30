import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TzworkschoolPage } from './tzworkschool.page';

describe('TzworkschoolPage', () => {
  let component: TzworkschoolPage;
  let fixture: ComponentFixture<TzworkschoolPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TzworkschoolPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TzworkschoolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
