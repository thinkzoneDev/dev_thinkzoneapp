import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TzworkshopPage } from './tzworkshop.page';

describe('TzworkshopPage', () => {
  let component: TzworkshopPage;
  let fixture: ComponentFixture<TzworkshopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TzworkshopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TzworkshopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
