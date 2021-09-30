import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblQuizPage } from './hbl-quiz.page';

describe('HblQuizPage', () => {
  let component: HblQuizPage;
  let fixture: ComponentFixture<HblQuizPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblQuizPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
