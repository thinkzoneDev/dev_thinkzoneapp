import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblPdfviewerPage } from './hbl-pdfviewer.page';

describe('HblPdfviewerPage', () => {
  let component: HblPdfviewerPage;
  let fixture: ComponentFixture<HblPdfviewerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblPdfviewerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblPdfviewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
