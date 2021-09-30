import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgeactivitymodalPage } from './pgeactivitymodal.page';

describe('PgeactivitymodalPage', () => {
  let component: PgeactivitymodalPage;
  let fixture: ComponentFixture<PgeactivitymodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgeactivitymodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgeactivitymodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
