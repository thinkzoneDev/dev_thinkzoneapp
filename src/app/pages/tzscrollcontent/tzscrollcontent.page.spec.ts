import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TzscrollcontentPage } from './tzscrollcontent.page';

describe('TzscrollcontentPage', () => {
  let component: TzscrollcontentPage;
  let fixture: ComponentFixture<TzscrollcontentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TzscrollcontentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TzscrollcontentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
