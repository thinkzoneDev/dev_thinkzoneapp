import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentdetailsPage } from './studentdetails.page';

describe('StudentgraghPage', () => {
  let component: StudentdetailsPage;
  let fixture: ComponentFixture<StudentdetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentdetailsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentdetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
