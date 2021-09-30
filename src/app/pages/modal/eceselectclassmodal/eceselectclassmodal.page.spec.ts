import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EceselectclassmodalPage } from './eceselectclassmodal.page';

describe('EceselectclassmodalPage', () => {
  let component: EceselectclassmodalPage;
  let fixture: ComponentFixture<EceselectclassmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EceselectclassmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EceselectclassmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
