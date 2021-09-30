import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditprofilemodalPage } from './editprofilemodal.page';

describe('EditprofilemodalPage', () => {
  let component: EditprofilemodalPage;
  let fixture: ComponentFixture<EditprofilemodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditprofilemodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditprofilemodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
