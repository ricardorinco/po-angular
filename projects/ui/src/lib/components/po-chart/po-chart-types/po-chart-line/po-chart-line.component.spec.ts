import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartLineComponent } from './po-chart-line.component';

describe('PoChartLineComponent', () => {
  let component: PoChartLineComponent;
  let fixture: ComponentFixture<PoChartLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PoChartLineComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
