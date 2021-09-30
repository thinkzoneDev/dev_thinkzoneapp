import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusmodalPage } from './statusmodal.page';

describe('StatusmodalPage', () => {
  let component: StatusmodalPage;
  let fixture: ComponentFixture<StatusmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
