import { Component, OnInit, Renderer2 } from '@angular/core';

import { PoChartDynamicTypeComponent } from '../po-chart-dynamic-type.component';
import { PoLineChartSeries } from './po-chart-line-series.interface';

const Padding: number = 24;

@Component({
  selector: 'po-po-chart-line',
  templateUrl: '../po-chart-dynamic-type.component.html'
})
export class PoChartLineComponent extends PoChartDynamicTypeComponent implements OnInit {
  // categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  maxValue: number;
  minValue: number;
  points: Array<any> = [];

  axisXLabels: Array<number> = [];
  numberOfAxisXGuides: number = 5;

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

    svgGroupElement.appendChild(this.drawXAxis());
    // svgGroupElement.appendChild(this.drawOuterYAxis());
    // svgGroupElement.appendChild(this.drawInnerYAxis());

    svgElement.appendChild(svgGroupElement);
    this.svgContainer.nativeElement.appendChild(svgElement);

    // this.createPaths();
    // this.createTexts();
  }

  drawXAxis() {
    const svgGroupElement = this.createSvgElement('g');

    console.log('axisXLabels', this.axisXLabels);

    this.axisXLabels.forEach((label, index) => {
      const svgPolylineElement = this.createSvgElement('polyline');

      this.renderer.setAttribute(svgPolylineElement, 'key', `line-axis-${index}`);
      this.renderer.setAttribute(svgPolylineElement, 'stroke', '#999');
      this.renderer.setAttribute(svgPolylineElement, 'strokeWidth', '0.2');
      this.renderer.setAttribute(svgPolylineElement, 'points', this.setPolylineXPoints(index));

      svgGroupElement.appendChild(svgPolylineElement);
    });
    console.log('svgGroupElement', svgGroupElement);

    return svgGroupElement;
  }

  drawOuterYAxis() {
    const svgGroupElement = this.createSvgElement('g');

    let index = 0;

    while (index < 2) {
      const svgPolylineElement = this.createSvgElement('polyline');

      this.renderer.setAttribute(svgPolylineElement, 'key', `line-axis-${index}`);
      this.renderer.setAttribute(svgPolylineElement, 'stroke', '#999');
      this.renderer.setAttribute(svgPolylineElement, 'strokeWidth', '0.2');
      this.renderer.setAttribute(svgPolylineElement, 'points', this.setPolylineYOuterPoints(index));

      svgGroupElement.appendChild(svgPolylineElement);

      index = index + 1;
    }

    return svgGroupElement;
  }

  setPolylineYOuterPoints(index) {
    const startY = Padding;
    const endY = this.svgHeight - Padding * 2;

    console.log('this.svgHeight', this.svgHeight);

    let xCoordinate;

    if (index === 0) {
      xCoordinate = Padding * 3;
    } else {
      xCoordinate = this.svgWidth - Padding;
    }

    // else if (index === this.categories.length) {

    // } else {
    // const xCoordinate = Padding + ratio * (this.svgWidth - Padding * 2);

    // }

    return `${xCoordinate}, ${startY}, ${xCoordinate}, ${endY}`;
  }

  drawInnerYAxis() {
    const svgGroupElement = this.createSvgElement('g');

    this.categories.forEach((label, index) => {
      const svgPolylineElement = this.createSvgElement('polyline');

      this.renderer.setAttribute(svgPolylineElement, 'key', `line-axis-${index}`);
      this.renderer.setAttribute(svgPolylineElement, 'stroke', '#999');
      this.renderer.setAttribute(svgPolylineElement, 'strokeWidth', '0.2');
      this.renderer.setAttribute(svgPolylineElement, 'points', this.setPolylineYPoints(index));

      svgGroupElement.appendChild(svgPolylineElement);
    });
    console.log('svgGroupElement', svgGroupElement);

    return svgGroupElement;
  }

  setPolylineYPoints(index) {
    const startY = Padding;

    const endY = this.svgHeight - Padding * 2;

    const ratio = (index + 1) / this.categories.length;
    const internalPlotableArea = this.svgWidth - Padding * 4;
    const xCoordinate = ratio * internalPlotableArea;

    return `${xCoordinate}, ${startY}, ${xCoordinate}, ${endY}`;
  }

  setPolylineXPoints(index) {
    const startX = Padding * 3;
    const endX = this.svgWidth - Padding;

    const ratio = index / (this.numberOfAxisXGuides - 1);
    const internalPlotableArea = this.svgHeight - Padding * 3;

    let percentage = ((index + 1 / this.numberOfAxisXGuides) * 100).toFixed(2);

    console.log('index', index);
    console.log('numberOfAxisXGuides', this.numberOfAxisXGuides);

    console.log('ratio', ratio);
    console.log('percentage', percentage);
    const yCoordinate = internalPlotableArea - internalPlotableArea * ratio + Padding;

    return `${startX}, ${yCoordinate}, ${endX}, ${yCoordinate}`;
  }

  // const startX = Padding * 3;
  // const endX = this.svgWidth - Padding;

  // const ratio = (index + 1) / (this.numberOfAxisXGuides + 1);
  // const yCoordinate = this.svgHeight - (this.svgHeight * ratio) + Padding;

  // return `${startX}, ${yCoordinate}, ${endX}, ${yCoordinate}`;

  defineAxisXLabels(maxValue: number, axisXSteps) {
    let index = 0;

    while (index < this.numberOfAxisXGuides) {
      const measurement = Math.ceil((maxValue / axisXSteps) * index);
      this.axisXLabels = [...this.axisXLabels, measurement];

      index = index + 1;
    }
  }

  // setPolylinePoints(columnAngle) {
  //   const positionsXY = [
  //     [0, 0],
  //     [this.polarToX(columnAngle, 0.5), this.polarToY(columnAngle, 0.5)]
  //   ];

  //   return positionsXY.map(point => point[0].toFixed(4) + ',' + point[1].toFixed(4)).join(' ');
  // }

  // setSvgGroupElementPosition(svgGroupElement) {
  //   this.renderer.setStyle(svgGroupElement, 'transform', `translate(${this.centerX || 0}px, ${this.height / 2 || 0}px)`);
  // }

  generalSetup() {
    this.calculateSVGContainerSize(this.chartWrapper, this.chartHeader, this.chartLegend);
    this.calculateSeriesMaxValue();
    this.defineAxisXLabels(this.maxValue, this.numberOfAxisXGuides);
    this.calculatePoints();
  }

  calculateSVGContainerSize(chartWrapperElement: number, chartHeaderElement: number, chartLegendElement: number) {
    const svgContainerHeightCalc = this.height - chartHeaderElement - chartLegendElement - Padding * 2;

    this.svgHeight = svgContainerHeightCalc <= 0 ? 0 : svgContainerHeightCalc;
    this.svgWidth = chartWrapperElement - Padding * 2;
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
