import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentregisterbytypePage } from './studentregisterbytype.page';

describe('StudentregisterbytypePage', () => {
  let component: StudentregisterbytypePage;
  let fixture: ComponentFixture<StudentregisterbytypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentregisterbytypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentregisterbytypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
