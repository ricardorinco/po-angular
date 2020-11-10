import { Component } from '@angular/core';

import { PoChartBarBaseComponent } from '../po-chart-bar-base.component';
import { PoChartColorService } from '../../../services/po-chart-color.service';
import { PoChartMathsService } from '../../../services/po-chart-maths.service';

import { PoChartContainerSize } from '../../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from '../../../interfaces/po-chart-min-max-values.interface';
import { PoChartAxisXLabelArea } from '../../../helpers/po-chart-default-values.constant';

@Component({
  selector: '[po-chart-column]',
  templateUrl: './po-chart-column.component.svg'
})
export class PoChartColumnComponent extends PoChartBarBaseComponent {
  constructor(protected colorService: PoChartColorService, protected mathsService: PoChartMathsService) {
    super(colorService, mathsService);
  }

  protected coordinates(
    seriesIndex: number,
    serieDataIndex: number,
    containerSize: PoChartContainerSize,
    minMaxSeriesValues: PoChartMinMaxValues,
    serieValue: number
  ) {
    const { svgWidth, svgPlottingAreaHeight } = containerSize;

    const areaPlotagem = svgWidth - PoChartAxisXLabelArea;
    const larguraDaCategoria = areaPlotagem / this.serieItemLength;
    const larguraDaBarra = larguraDaCategoria / this.series.length / 2;

    // const indexDividedBySeriesLength = seriesIndex / (this.serieItemLength);
    // const xRatio = isNaN(indexDividedBySeriesLength) ? 0 : indexDividedBySeriesLength;

    const xRatio = serieDataIndex / (this.serieItemLength - 1);

    const x1 = PoChartAxisXLabelArea + areaPlotagem * xRatio;

    // const x1 = (PoChartAxisXLabelArea + xRatio * areaPlotagem) + ((larguraDaCategoria / 4 + larguraDaBarra) * serieDataIndex);

    // const x1 = (PoChartAxisXLabelArea + areaPlotagem + ((larguraDaCategoria / 4) + larguraDaBarra) * index) * xRatio;

    // const x1 = PoChartAxisXLabelArea + xRatio * areaPlotagem + (larguraDaCategoria / this.series.length) + larguraDaBarra * serieDataIndex;
    // const x1 = PoChartAxisXLabelArea + xRatio * areaPlotagem + (larguraDaCategoria / this.series.length) + larguraDaBarra * serieIndex;

    // const x1 = Padding * 3 + ratioX * (this.svgWidth - Padding * 4) + range / 4 + barWidth * serieIndex;

    console.log('verifica xRatio:::', xRatio);
    console.log('verifica:::', PoChartAxisXLabelArea + xRatio * areaPlotagem);

    const x2 = x1 + larguraDaBarra;

    const yRatio = this.mathsService.getSeriePercentage(minMaxSeriesValues, serieValue);
    const y1 = svgPlottingAreaHeight;
    const y2 = svgPlottingAreaHeight - svgPlottingAreaHeight * yRatio;

    const pathCoordinates = ['M', x1, y2, 'L', x2, y2, 'L', x2, y1, 'L', x1, y1, 'z'].join(' ');

    return pathCoordinates;
  }

  // protected xCoordinate(index: number, containerSize: PoChartContainerSize) {
  //   // const divideIndexBySeriesLength = index / (this.seriesLength - 1);
  //   // const xRatio = isNaN(divideIndexBySeriesLength) ? 0 : divideIndexBySeriesLength;
  //   // const svgAxisSideSpacing = this.mathsService.calculateSideSpacing(containerSize.svgWidth, this.seriesLength);

  //   // return PoChartAxisXLabelArea + svgAxisSideSpacing + containerSize.svgPlottingAreaWidth * xRatio;
  // }

  // protected yCoordinate(
  //   minMaxSeriesValues: PoChartMinMaxValues,
  //   serieValue: number,
  //   containerSize: PoChartContainerSize
  // ) {
  //   // const yRratio = this.mathsService.getSeriePercentage(minMaxSeriesValues, serieValue);
  //   // const yCoordinate =
  //   //   containerSize.svgPlottingAreaHeight - containerSize.svgPlottingAreaHeight * yRratio + PoChartPlotAreaPaddingTop;

  //   // return Math.floor(yCoordinate);
  // }
}
