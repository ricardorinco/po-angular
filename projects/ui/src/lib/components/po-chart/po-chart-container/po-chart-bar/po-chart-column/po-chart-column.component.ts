import { Component } from '@angular/core';

import {
  PoChartAxisXLabelArea,
  PoChartExternalBarMargim,
  PoChartPlotAreaPaddingTop,
  PoChartSpaceBetweenBars
} from '../../../helpers/po-chart-default-values.constant';

import { PoChartBarBaseComponent } from '../po-chart-bar-base.component';
import { PoChartColorService } from '../../../services/po-chart-color.service';
import { PoChartMathsService } from '../../../services/po-chart-maths.service';

import { PoChartContainerSize } from '../../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from '../../../interfaces/po-chart-min-max-values.interface';

@Component({
  selector: '[po-chart-column]',
  templateUrl: './po-chart-column.component.svg'
})
export class PoChartColumnComponent extends PoChartBarBaseComponent {
  constructor(protected colorService: PoChartColorService, protected mathsService: PoChartMathsService) {
    super(colorService, mathsService);
  }

  protected barCoordinates(
    seriesIndex: number,
    serieItemDataIndex: number,
    containerSize: PoChartContainerSize,
    minMaxSeriesValues: PoChartMinMaxValues,
    serieValue: number
  ) {
    const { svgWidth, svgPlottingAreaHeight } = containerSize;
    const { chartBarPlotArea, barWidth } = this.calculateElementsMeasurements(svgWidth);

    const { x1, x2 } = this.xCoordinates(seriesIndex, serieItemDataIndex, chartBarPlotArea, barWidth);
    const { y1, y2 } = this.yCoordinates(minMaxSeriesValues, svgPlottingAreaHeight, serieValue);

    const pathCoordinates = ['M', x1, y2, 'L', x2, y2, 'L', x2, y1, 'L', x1, y1, 'z'].join(' ');

    return pathCoordinates;
  }

  private calculateElementsMeasurements(svgWidth: PoChartContainerSize['svgWidth']) {
    const chartBarPlotArea = svgWidth - PoChartAxisXLabelArea;
    const categoryWidth = chartBarPlotArea / this.seriesGreaterLength;
    const barWidth =
      (categoryWidth - PoChartSpaceBetweenBars * (this.series.length - 1) - PoChartExternalBarMargim * 2) /
      this.series.length;

    return { chartBarPlotArea, barWidth };
  }

  private xCoordinates(seriesIndex: number, serieItemDataIndex: number, chartBarPlotArea: number, barWidth: number) {
    const indexDividedBySeriesLength = serieItemDataIndex / this.seriesGreaterLength;
    const xRatio = isNaN(indexDividedBySeriesLength) ? 0 : indexDividedBySeriesLength;

    const x1 =
      PoChartAxisXLabelArea +
      chartBarPlotArea * xRatio +
      PoChartExternalBarMargim +
      (barWidth * seriesIndex + PoChartSpaceBetweenBars * seriesIndex);
    const x2 = x1 + barWidth;

    return { x1, x2 };
  }

  private yCoordinates(minMaxSeriesValues: PoChartMinMaxValues, svgPlottingAreaHeight: number, serieValue: number) {
    const yRatio = this.mathsService.getSeriePercentage(minMaxSeriesValues, serieValue);
    const y1 = svgPlottingAreaHeight + PoChartPlotAreaPaddingTop;
    const y2 = svgPlottingAreaHeight - svgPlottingAreaHeight * yRatio + PoChartPlotAreaPaddingTop;

    return { y1, y2 };
  }
}
