import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInfoChartComponent } from './student-info-chart.component';

describe('StudentInfoChartComponent', () => {
  let component: StudentInfoChartComponent;
  let fixture: ComponentFixture<StudentInfoChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentInfoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentInfoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
