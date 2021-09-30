import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncappPage } from './syncapp.page';

describe('SyncappPage', () => {
  let component: SyncappPage;
  let fixture: ComponentFixture<SyncappPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncappPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncappPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
