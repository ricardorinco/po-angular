import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoChartContainerSize } from '../../../interfaces/po-chart-container-size.interface';
import { PoChartModule } from '../../../po-chart.module';
import { PoChartBarBaseComponent } from '../po-chart-bar-base.component';

import { PoChartColumnComponent } from './po-chart-column.component';

describe('PoChartColumnComponent', () => {
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

  it('should create', () => {
    expect(component instanceof PoChartBarBaseComponent).toBeTruthy();
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('barCoordinates:', () => {
      it('should call `calculateElementsMeasurements`, `xCoordinates` and `yCoordinates`', () => {
        const seriesIndex = 0;
        const serieItemDataIndex = 0;
        const containerSize = component.containerSize;
        const minMaxSeriesValues = component['mathsService'].calculateMinAndMaxValues(component.series);
        const serieValue = 1;

        const spyCalculateElementsMeasurements = spyOn(
          component,
          <any>'calculateElementsMeasurements'
        ).and.callThrough();
        const spyXCoordinates = spyOn(component, <any>'xCoordinates').and.callThrough();
        const spyYCoordinates = spyOn(component, <any>'yCoordinates').and.callThrough();

        component['barCoordinates'](seriesIndex, serieItemDataIndex, containerSize, minMaxSeriesValues, serieValue);

        expect(spyCalculateElementsMeasurements).toHaveBeenCalled();
        expect(spyXCoordinates).toHaveBeenCalled();
        expect(spyYCoordinates).toHaveBeenCalled();
      });

      it('should return a string for the coordinates:', () => {
        const seriesIndex = 0;
        const serieItemDataIndex = 0;
        const containerSize = component.containerSize;
        const minMaxSeriesValues = component['mathsService'].calculateMinAndMaxValues(component.series);
        const serieValue = 1;

        const expectedResult = component['barCoordinates'](
          seriesIndex,
          serieItemDataIndex,
          containerSize,
          minMaxSeriesValues,
          serieValue
        );
        expect(expectedResult).toBe('M 86 37 L 100 37 L 100 28 L 86 28 z');
      });
    });

    it('shouldn`t subctract the spaceBetweenBars calculation by the X coordinate if series.length is lower than 2', () => {
      const seriesIndex = 0;
      const serieItemDataIndex = 0;
      const containerSize = component.containerSize;
      const minMaxSeriesValues = component['mathsService'].calculateMinAndMaxValues(component.series);
      const serieValue = 1;

      component.series = [series.shift()];

      const expectedResult = component['barCoordinates'](
        seriesIndex,
        serieItemDataIndex,
        containerSize,
        minMaxSeriesValues,
        serieValue
      );
      expect(expectedResult).toBe('M 86 28 L 100 28 L 100 28 L 86 28 z');
    });

    it('should consider serieValue as 0 for calculations if it is a negative value', () => {
      const seriesIndex = 0;
      const serieItemDataIndex = 0;
      const containerSize = component.containerSize;
      const minMaxSeriesValues = component['mathsService'].calculateMinAndMaxValues(component.series);
      const serieValue = -10;

      const expectedResult = component['barCoordinates'](
        seriesIndex,
        serieItemDataIndex,
        containerSize,
        minMaxSeriesValues,
        serieValue
      );
      expect(expectedResult).toBe('M 86 38 L 100 38 L 100 28 L 86 28 z');
    });
  });
});
