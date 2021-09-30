import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillchartTablePage } from './skillchart-table.page';

describe('SkillchartTablePage', () => {
  let component: SkillchartTablePage;
  let fixture: ComponentFixture<SkillchartTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillchartTablePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillchartTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
