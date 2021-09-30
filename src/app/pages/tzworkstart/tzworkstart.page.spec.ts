import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TzworkstartPage } from './tzworkstart.page';

describe('TzworkstartPage', () => {
  let component: TzworkstartPage;
  let fixture: ComponentFixture<TzworkstartPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TzworkstartPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TzworkstartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
