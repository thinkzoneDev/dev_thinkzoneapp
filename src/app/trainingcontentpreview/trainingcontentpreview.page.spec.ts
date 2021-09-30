import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingcontentpreviewPage } from './trainingcontentpreview.page';

describe('TrainingcontentpreviewPage', () => {
  let component: TrainingcontentpreviewPage;
  let fixture: ComponentFixture<TrainingcontentpreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingcontentpreviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingcontentpreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
