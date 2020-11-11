import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoChartContainerSize } from '../../../interfaces/po-chart-container-size.interface';
import { PoChartModule } from '../../../po-chart.module';
import { PoChartBarBaseComponent } from '../po-chart-bar-base.component';

import { PoChartColumnComponent } from './po-chart-column.component';

fdescribe('PoChartColumnComponent', () => {
  let component: PoChartColumnComponent;
  let fixture: ComponentFixture<PoChartColumnComponent>;

  const series = [
    { label: 'category', data: [1, 2, 3] },
    { label: 'category B', data: [10, 20, 30] }
  ];
  const containerSize: PoChartContainerSize = {
    svgWidth: 200,
    svgHeight: 200,
    svgPlottingAreaWidth: 20,
    svgPlottingAreaHeight: 20
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartColumnComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartColumnComponent);
    component = fixture.componentInstance;
    component.series = series;
    component.containerSize = containerSize;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component instanceof PoChartBarBaseComponent).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
