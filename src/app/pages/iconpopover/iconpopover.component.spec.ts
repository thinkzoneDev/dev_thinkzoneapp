import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconpopoverComponent } from './iconpopover.component';

describe('IconpopoverComponent', () => {
  let component: IconpopoverComponent;
  let fixture: ComponentFixture<IconpopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconpopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconpopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
