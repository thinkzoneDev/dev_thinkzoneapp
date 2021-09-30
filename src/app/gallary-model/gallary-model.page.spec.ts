import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GallaryModelPage } from './gallary-model.page';

describe('GallaryModelPage', () => {
  let component: GallaryModelPage;
  let fixture: ComponentFixture<GallaryModelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GallaryModelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GallaryModelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
