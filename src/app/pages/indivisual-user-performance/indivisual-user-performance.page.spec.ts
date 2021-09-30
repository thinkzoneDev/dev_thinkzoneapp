import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndivisualUserPerformancePage } from './indivisual-user-performance.page';

describe('IndivisualUserPerformancePage', () => {
  let component: IndivisualUserPerformancePage;
  let fixture: ComponentFixture<IndivisualUserPerformancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndivisualUserPerformancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndivisualUserPerformancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
