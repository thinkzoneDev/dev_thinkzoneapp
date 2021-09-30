import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherBaselinePage } from './teacherbaselinedndline.page';

describe('TeacherBaselinePage', () => {
  let component: TeacherBaselinePage;
  let fixture: ComponentFixture<TeacherBaselinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherBaselinePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherBaselinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
