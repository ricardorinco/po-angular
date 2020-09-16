import { Component, OnInit, Renderer2 } from '@angular/core';

import { PoChartDynamicTypeComponent } from '../po-chart-dynamic-type.component';
import { PoLineChartSeries } from './po-chart-line-series.interface';

const Padding: number = 24;

@Component({
  selector: 'po-po-chart-line',
  templateUrl: '../po-chart-dynamic-type.component.html'
})
export class PoChartLineComponent extends PoChartDynamicTypeComponent implements OnInit {
  categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  maxValue: number;
  minValue: number;
  digitsPrecision: number = 0;
  points: Array<any> = [];

  svgInternalAreaHeight;
  svgInternalAreaWidth;

  axisXLabels: Array<number | string> = [];
  numberOfHorizontalGuides: number = 5;

  constructor(private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this.chartInitSetup();
  }

  private chartInitSetup() {
    this.generalSetup();
    this.createSVGElements();
    // this.calculateTotalValue();
    // this.calculateAngleRadians();
    // this.animationSetup();
  }

  createSvgElement(element) {
    return this.renderer.createElement(`svg:${element}`, 'svg');
  }

  createSVGElements() {
    const svgElement = this.createSvgElement('svg');
    const svgGroupElement = this.createSvgElement('g');

    // this.setSvgGroupElementPosition(svgGroupElement);
    this.renderer.setAttribute(svgElement, 'width', `${this.svgWidth}`);
    this.renderer.setAttribute(svgElement, 'height', `${this.svgHeight}`);
    this.renderer.setAttribute(svgElement, 'viewBox', `0 0 ${this.svgWidth} ${this.svgHeight}`);
    this.renderer.setAttribute(svgElement, 'preserveAspectRatio', `xMidYMin meet`);
    this.renderer.setAttribute(svgElement, 'class', 'po-chart-svg-element');

    svgGroupElement.appendChild(this.drawAxisX());
    svgGroupElement.appendChild(this.drawAxisXLabels());
    svgGroupElement.appendChild(this.drawOuterAxisY());
    svgGroupElement.appendChild(this.drawInnerAxisY());

    svgElement.appendChild(svgGroupElement);
    this.svgContainer.nativeElement.appendChild(svgElement);

    // this.createPaths();
    // this.createTexts();
  }

  drawAxisX() {
    const svgGroupElement = this.createSvgElement('g');

    this.axisXLabels.forEach((label, index) => {
      const svgPolylineElement = this.createSvgElement('polyline');

      this.renderer.setAttribute(svgPolylineElement, 'key', `line-axis-${index + 1}`);
      this.renderer.setAttribute(svgPolylineElement, 'stroke', '#999');
      this.renderer.setAttribute(svgPolylineElement, 'strokeWidth', '0.2');
      this.renderer.setAttribute(svgPolylineElement, 'points', this.setAxisXPoints(index));

      svgGroupElement.appendChild(svgPolylineElement);
    });

    return svgGroupElement;
  }

  // drawAxisLabels() {
  //   const svgGroupElement = this.createSvgElement('g');

  //   for (let i = 0; i <= this.numberOfScales; i++) {
  //     // aqui é necessário fazer a lógica para formatação de escalas. item não feito.
  //     const currentScaleAxisSize = i / this.numberOfScales;

  //     svgGroupElement.appendChild(this.createScaleLabels(currentScaleAxisSize, i));
  //   }

  //   return svgGroupElement;
  // }

  drawAxisXLabels() {
    const svgGroupElement = this.createSvgElement('g');

    this.axisXLabels.forEach((axisLabel, index) => {
      svgGroupElement.appendChild(this.createAxisLabels(axisLabel, index));
    });

    return svgGroupElement;
  }

  createAxisLabels(axisLabel, index) {
    const svgTextElement = this.createSvgElement('text');
    const points = this.calculateAxisXLabelsPoints(axisLabel, index);

    svgTextElement.textContent = axisLabel.toString();

    this.renderer.setAttribute(svgTextElement, 'key', `axis-label-value-${index + 1}`);
    this.renderer.setAttribute(svgTextElement, 'x', points[0]);
    this.renderer.setAttribute(svgTextElement, 'y', points[1]);
    this.renderer.setAttribute(svgTextElement, 'text-anchor', 'end');
    this.renderer.setAttribute(svgTextElement, 'dominant-baseline', 'middle');
    this.renderer.setAttribute(svgTextElement, 'font-weight', '600');
    this.renderer.setAttribute(svgTextElement, 'font-size', '12');

    return svgTextElement;
  }

  calculateAxisXLabelsPoints(axisLabel, index) {
    const textPadding = 8;
    const xCoordinate = Padding * 3 - textPadding;

    const ratio = index / (this.numberOfHorizontalGuides - 1);
    const yCoordinate = this.svgInternalAreaHeight - this.svgInternalAreaHeight * ratio + Padding;

    return [xCoordinate.toString(), yCoordinate.toString()];

    // const y = height - padding + FONT_SIZE * 2;
  }

  // const startX = Padding * 3;
  // const endX = this.svgWidth - Padding;

  // const ratio = index / (this.numberOfHorizontalGuides - 1);
  // const yCoordinate = this.svgInternalAreaHeight - (this.svgInternalAreaHeight * ratio) + Padding;

  // return `${startX}, ${yCoordinate}, ${endX}, ${yCoordinate}`;

  drawOuterAxisY() {
    const svgGroupElement = this.createSvgElement('g');

    [...Array(2)].forEach((_, index) => {
      const svgPolylineElement = this.createSvgElement('polyline');

      this.renderer.setAttribute(svgPolylineElement, 'key', `line-axis-${index + 1}`);
      this.renderer.setAttribute(svgPolylineElement, 'stroke', '#999');
      this.renderer.setAttribute(svgPolylineElement, 'strokeWidth', '0.2');
      this.renderer.setAttribute(svgPolylineElement, 'points', this.setPolylineYOuterPoints(index));

      svgGroupElement.appendChild(svgPolylineElement);
    });

    return svgGroupElement;
  }

  drawInnerAxisY() {
    const svgGroupElement = this.createSvgElement('g');

    this.categories.forEach((label, index) => {
      const svgPolylineElement = this.createSvgElement('polyline');

      this.renderer.setAttribute(svgPolylineElement, 'key', `line-axis-${index + 1}`);
      this.renderer.setAttribute(svgPolylineElement, 'stroke', '#999');
      this.renderer.setAttribute(svgPolylineElement, 'strokeWidth', '0.2');
      this.renderer.setAttribute(svgPolylineElement, 'points', this.setPolylineYPoints(index));

      svgGroupElement.appendChild(svgPolylineElement);
    });

    return svgGroupElement;
  }

  setAxisXPoints(index) {
    const startX = Padding * 3;
    const endX = this.svgWidth - Padding;

    const ratio = index / (this.numberOfHorizontalGuides - 1);
    const yCoordinate = this.svgInternalAreaHeight - this.svgInternalAreaHeight * ratio + Padding;

    return `${startX}, ${yCoordinate}, ${endX}, ${yCoordinate}`;
  }

  setPolylineYOuterPoints(index) {
    const startY = Padding;
    const endY = this.svgHeight - Padding * 2;

    const outerXCoordinate = index === 0 ? Padding * 3 : this.svgWidth - Padding;

    return `${outerXCoordinate}, ${startY}, ${outerXCoordinate}, ${endY}`;
  }

  setPolylineYPoints(index) {
    const startY = Padding;
    const endY = this.svgHeight - Padding * 2;

    const ratio = index / (this.categories.length - 1);
    const xCoordinate = Padding * 5 + ratio * this.svgInternalAreaWidth;

    return `${xCoordinate}, ${startY}, ${xCoordinate}, ${endY}`;
  }

  defineAxisXLabels(maxValue: number, numberOfHorizontalGuides: number) {
    [...Array(numberOfHorizontalGuides)].forEach((_, index: number) => {
      const AxisXLabelsMeasurement = (this.maxValue * (index / (numberOfHorizontalGuides - 1))).toFixed(
        this.digitsPrecision
      );

      this.axisXLabels = [...this.axisXLabels, AxisXLabelsMeasurement];
    });
  }

  generalSetup() {
    this.calculateSVGContainerSize(this.chartWrapper, this.chartHeader, this.chartLegend);
    this.calculateSeriesMaxValue();
    this.defineAxisXLabels(this.maxValue, this.numberOfHorizontalGuides);
    this.calculatePoints();
  }

  calculateSVGContainerSize(chartWrapperElement: number, chartHeaderElement: number, chartLegendElement: number) {
    const svgContainerHeightCalc = this.height - chartHeaderElement - chartLegendElement - Padding * 2;

    this.svgHeight = svgContainerHeightCalc <= 0 ? 0 : svgContainerHeightCalc;
    this.svgWidth = chartWrapperElement - Padding * 2;

    // Coordenadas para área de plotagem dos pontos das séries e também para área interna do grid:
    // Largura que subtrai a largura do container SVG pelo padding lateral, área de labelY e margem interna do grid.
    this.svgInternalAreaWidth = this.svgWidth - Padding * 8;
    // Altura que subtrai a altura do container SVG pelo padding superior, inferior e área de labelX.
    this.svgInternalAreaHeight = this.svgHeight - Padding * 3;
  }

  calculateSeriesMaxValue() {
    const maxDataValue = Math.max.apply(
      Math,
      this.series.map((serie: PoLineChartSeries) => {
        return Math.max.apply(
          Math,
          serie.value.map((data: number) => {
            return data;
          })
        );
      })
    );

    this.maxValue = Math.ceil(maxDataValue / 100) * 100;

    // calcMaxValue : function(){
    //   this.maxValue = 0;
    //   for(x=0; x < this.values.length; x++){
    //     if(this.values[x] > this.maxValue){
    //       this.maxValue = this.values[x];
    //     }
    //   }
    //   // Round up to next integer
    //   this.maxValue = Math.ceil(this.maxValue);
    // }
  }

  calculatePoints() {
    this.series.forEach((serie: PoLineChartSeries) => {
      let steps = 100 / serie.value.length - 1;
      let points = '';
      serie.value.forEach((data, index) => {
        let percentage = data / this.maxValue;
        let point = `${(steps * index).toFixed(2)},${(this.svgHeight - this.svgHeight * percentage).toFixed(2)} `;
        points += point;
      });

      this.points = [...this.points, { coordinates: points }];
    });
    // calcPoints : function(){
    //   this.points = [];
    //   if(this.values.length > 1){
    //     // First point is bottom left hand side (max value is the bottom of graph)
    //     var points = "0," + chart.height + " ";
    //     // Loop through each value
    //     for(x=0; x < this.values.length; x++){
    //       // Calculate the perecentage of this value/the max value
    //       var perc  = this.values[x] / this.maxValue;
    //       // Steps is a percentage (100) / the total amount of values
    //       var steps = 100 / ( this.values.length - 1 );
    //       // Create the point, limit points to 2 decimal points,
    //       // Y co-ord is calculated by the taking the chart height,
    //       // then subtracting (chart height * the percentage of this point)
    //       // Remember the & co-ord is measured from the top not the bottom like a traditional graph
    //       var point = (steps * (x )).toFixed(2) + "," + (this.height - (this.height * perc)).toFixed(2) + " ";
    //       // Add this point
    //       points += point;
    //     }
    //     // Add the final point (bottom right)
    //     points += "100," + this.height;
    //     this.points = points;
  }
}
