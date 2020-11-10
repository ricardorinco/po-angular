import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { PoChartColorService } from '../../services/po-chart-color.service';
import { PoChartMathsService } from '../../services/po-chart-maths.service';

import { PoChartType } from '../../enums/po-chart-type.enum';
import { PoChartAxisOptions } from '../../interfaces/po-chart-axis-options.interface';
import { PoBarChartSeries } from '../../interfaces/po-chart-bar-series.interface';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from '../../interfaces/po-chart-min-max-values.interface';
import { PoChartBarCoordinates } from '../../interfaces/po-chart-bar-coordinates.interface';

@Directive()
export abstract class PoChartBarBaseComponent {
  colors: Array<string>;
  seriesPathsCoordinates: Array<Array<PoChartBarCoordinates>>;
  // seriesPointsCoordinates: Array<Array<PoChartBarCoordinates>> = [];

  protected serieItemLength: number;

  private minMaxSeriesValues: PoChartMinMaxValues;
  private firstValidItemFromSerieArray: boolean;

  private _containerSize: PoChartContainerSize = {};
  private _options: PoChartAxisOptions;
  private _series: Array<PoBarChartSeries> = [];

  @Input('p-categories') categories: Array<string>;

  @Input('p-container-size') set containerSize(value: PoChartContainerSize) {
    this._containerSize = value;

    this.getDomainValues(this.options);
    this.seriePathPointsDefinition(this._containerSize, this.series, this.minMaxSeriesValues);
  }

  get containerSize() {
    return this._containerSize;
  }

  @Input('p-series') set series(seriesList: Array<PoBarChartSeries>) {
    const seriesDataArrayFilter = seriesList.filter(serie => {
      return Array.isArray(serie.data);
    });

    if (seriesDataArrayFilter.length) {
      this._series = seriesDataArrayFilter;
      this.serieItemLength = this.mathsService.seriesGreaterLength(this.series);
      this.colors = this.colorService.getSeriesColor(this._series, PoChartType.Column);
      this.getDomainValues(this.options);
      this.seriePathPointsDefinition(this.containerSize, seriesDataArrayFilter, this.minMaxSeriesValues);
    } else {
      this._series = [];
    }
  }

  get series() {
    return this._series;
  }

  @Input('p-options') set options(value: PoChartAxisOptions) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._options = value;

      this.getDomainValues(this.options);
      this.seriePathPointsDefinition(this.containerSize, this._series, this.minMaxSeriesValues);
    }
  }

  get options() {
    return this._options;
  }

  @Output('p-point-click') pointClick = new EventEmitter<any>();

  @Output('p-point-hover') pointHover = new EventEmitter<any>();

  constructor(protected colorService: PoChartColorService, protected mathsService: PoChartMathsService) {}

  trackBy(index) {
    return index;
  }

  private getDomainValues(options: PoChartAxisOptions = {}): void {
    this.minMaxSeriesValues = this.mathsService.calculateMinAndMaxValues(this._series);

    const minValue =
      options.minRange < this.minMaxSeriesValues.minValue ? options.minRange : this.minMaxSeriesValues.minValue;
    const maxValue =
      options.maxRange > this.minMaxSeriesValues.maxValue ? options.maxRange : this.minMaxSeriesValues.maxValue;
    const minMaxUpdatedValues = { minValue, maxValue };

    this.minMaxSeriesValues = {
      ...this.minMaxSeriesValues,
      ...minMaxUpdatedValues
    };
  }

  private seriePathPointsDefinition(
    containerSize: PoChartContainerSize,
    series: Array<PoBarChartSeries>,
    minMaxSeriesValues: PoChartMinMaxValues
  ) {
    // this.seriesPointsCoordinates = [];

    this.seriesPathsCoordinates = series.map((serie: PoBarChartSeries, seriesIndex) => {
      if (Array.isArray(serie.data)) {
        // let pathCoordinates: string = '';
        let pointCoordinates: Array<PoChartBarCoordinates> = [];
        this.firstValidItemFromSerieArray = true;

        serie.data.forEach((serieValue, serieDataIndex) => {
          if (this.mathsService.verifyIfFloatOrInteger(serieValue)) {
            const svgPathCommand = this.svgPathCommand();

            const coordinates = this.coordinates(
              seriesIndex,
              serieDataIndex,
              containerSize,
              minMaxSeriesValues,
              serieValue
            );

            // const xCoordinate = this.xCoordinate(index, containerSize);
            // const yCoordinate = this.yCoordinate(minMaxSeriesValues, serieValue, containerSize);
            const category = this.serieCategory(seriesIndex, this.categories);
            const label = serie['label'];
            const tooltipLabel = this.serieLabel(serieValue, label);

            // pathCoordinates = coordinates;
            pointCoordinates = [...pointCoordinates, { category, label, tooltipLabel, data: serieValue, coordinates }];
            // pathCoordinates += ` ${svgPathCommand}${xCoordinate} ${yCoordinate}`;
          }
        });
        // this.seriesPointsCoordinates = [...this.seriesPointsCoordinates, pointCoordinates];

        return pointCoordinates;
      }
    });

    console.log('seriesPathsCoordinates:::', this.seriesPathsCoordinates);
  }

  private serieCategory(index: number, categories: Array<string> = []) {
    return categories[index] ?? undefined;
  }

  private serieLabel(serieValue: number, label: string) {
    const hasLabel = label !== null && label !== undefined && label !== '';

    return hasLabel ? `${label}: ${serieValue}` : serieValue.toString();
  }

  private svgPathCommand() {
    const command = this.firstValidItemFromSerieArray ? 'M' : 'L';
    // firstValidItemFromSerieArray: tratamento para permitir ao usuário definir o primeiro valor como null para que seja ignorado;
    this.firstValidItemFromSerieArray = false;

    return command;
  }

  protected abstract coordinates(
    seriesIndex: number,
    serieDataIndex: number,
    containerSize: PoChartContainerSize,
    minMaxSeriesValues: PoChartMinMaxValues,
    serieValue: number
  );

  // protected abstract xCoordinate(index: number, containerSize: PoChartContainerSize);
  // protected abstract yCoordinate(minMaxSeriesValues: PoChartMinMaxValues, serieValue: number, containerSize: PoChartContainerSize);
}
