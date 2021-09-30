import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblPopoverComponent } from './hbl-popover.component';

describe('HblPopoverComponent', () => {
  let component: HblPopoverComponent;
  let fixture: ComponentFixture<HblPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
