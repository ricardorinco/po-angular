import { Component, OnInit, Renderer2 } from '@angular/core';

import { PoChartDynamicTypeComponent } from '../po-chart-dynamic-type.component';

const Padding: number = 24;

@Component({
  selector: 'po-po-chart-bar',
  templateUrl: '../po-chart-dynamic-type.component.html'
})
export class PoChartBarComponent extends PoChartDynamicTypeComponent implements OnInit {
  // categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

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
  }

  createSvgElement(element) {
    return this.renderer.createElement(`svg:${element}`, 'svg');
  }

  generalSetup() {
    this.calculateSVGContainerSize(this.chartWrapper, this.chartHeader, this.chartLegend);
    this.calculateSeriesMaxValue();
    this.defineAxisXLabels(this.maxValue, this.numberOfHorizontalGuides);
  }

  calculateSVGContainerSize(chartWrapperElement: number, chartHeaderElement: number, chartLegendElement: number) {
    const svgContainerHeightCalc = this.height - chartHeaderElement - chartLegendElement - Padding * 2;

    this.svgHeight = svgContainerHeightCalc <= 0 ? 0 : svgContainerHeightCalc;
    this.svgWidth = chartWrapperElement - Padding * 2;

    // Coordenadas para área de plotagem dos pontos das séries e também para área interna do grid:
    // Largura que subtrai a largura do container SVG pelo padding lateral, área de labelY e margem interna do grid.
    this.svgInternalAreaWidth = this.svgWidth - Padding * 8;
    // Altura que subtrai a altura do container SVG pelo padding superior, inferior e área de labelX.
    this.svgInternalAreaHeight = this.svgHeight - Padding * 2;
  }

  calculateSeriesMaxValue() {
    const maxDataValue = Math.max.apply(
      Math,
      this.series.map((serie: any) => {
        return Math.max.apply(
          Math,
          serie.values.map((data: number) => {
            return data;
          })
        );
      })
    );

    this.maxValue = Math.ceil(maxDataValue / 100) * 100;
  }

  defineAxisXLabels(maxValue: number, numberOfHorizontalGuides: number) {
    [...Array(numberOfHorizontalGuides)].forEach((_, index: number) => {
      const AxisXLabelsMeasurement = (this.maxValue * (index / (numberOfHorizontalGuides - 1))).toFixed(
        this.digitsPrecision
      );

      this.axisXLabels = [...this.axisXLabels, AxisXLabelsMeasurement];
    });
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
    svgGroupElement.appendChild(this.drawAxisYLabels());

    svgGroupElement.appendChild(this.drawSeries());

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

  drawAxisXLabels() {
    const svgGroupElement = this.createSvgElement('g');

    this.axisXLabels.forEach((axisLabel, index) => {
      svgGroupElement.appendChild(this.createAxisXLabels(axisLabel, index));
    });

    return svgGroupElement;
  }

  createAxisXLabels(axisLabel, index) {
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
  }

  drawAxisYLabels() {
    const svgGroupElement = this.createSvgElement('g');

    this.categories.forEach((category, index) => {
      svgGroupElement.appendChild(this.createAxisYLabels(category, index));
    });

    return svgGroupElement;
  }

  createAxisYLabels(axisLabel, index) {
    const svgTextElement = this.createSvgElement('text');
    const points = this.calculateAxisYLabelsPoints(axisLabel, index);

    svgTextElement.textContent = axisLabel.toString();

    this.renderer.setAttribute(svgTextElement, 'key', `axis-label-value-${index + 1}`);
    this.renderer.setAttribute(svgTextElement, 'x', points[0]);
    this.renderer.setAttribute(svgTextElement, 'y', points[1]);
    this.renderer.setAttribute(svgTextElement, 'text-anchor', 'middle');
    this.renderer.setAttribute(svgTextElement, 'font-weight', '600');
    this.renderer.setAttribute(svgTextElement, 'font-size', '12');

    return svgTextElement;
  }

  calculateAxisYLabelsPoints(axisLabel, index) {
    const textPadding = 8;

    const yCoordinate = this.svgHeight - textPadding;

    const ratio = index / this.categories.length;

    // calculo para o range, importante
    const range = (this.svgWidth - Padding * 4) / this.categories.length;

    const xCoordinate = Padding * 3 + ratio * (this.svgWidth - Padding * 4) + range / 2;

    return [xCoordinate.toString(), yCoordinate.toString()];
  }

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
    const endY = this.svgHeight - Padding;

    const outerXCoordinate = index === 0 ? Padding * 3 : this.svgWidth - Padding;

    return `${outerXCoordinate}, ${startY}, ${outerXCoordinate}, ${endY}`;
  }

  setPolylineYPoints(index) {
    const startY = Padding;
    const endY = this.svgHeight - Padding;

    const ratio = index / this.categories.length;

    // padding * 3 = x inicial de plotagem / padding * 4 = svgWIdth - x inicial - padding final
    const xCoordinate = Padding * 3 + ratio * (this.svgWidth - Padding * 4);

    return `${xCoordinate}, ${startY}, ${xCoordinate}, ${endY}`;
  }

  drawSeries() {
    const svgGroupElement = this.createSvgElement('g');
    this.series.forEach((serie, index) => {
      const serieIndex = index;
      serie.values.forEach((dataValue, index) => {
        const svgPathElement = this.createSvgElement('path');

        this.renderer.setAttribute(svgPathElement, 'key', `path-${index + 1}`);
        this.renderer.setAttribute(svgPathElement, 'd', `${this.getColumnPaths(dataValue, index, serieIndex)}`);
        this.renderer.setAttribute(svgPathElement, 'stroke', 'red');
        this.renderer.setAttribute(svgPathElement, 'stroke-width', '2');
        this.renderer.setAttribute(svgPathElement, 'fill', 'transparent');
        // this.renderer.setAttribute(svgPathElement, 'fill-opacity', '.1');

        svgGroupElement.appendChild(svgPathElement);
      });
    });

    return svgGroupElement;
  }

  getColumnPaths(dataValue, index, serieIndex) {
    // largura da coluna
    const range = (this.svgWidth - Padding * 4) / this.categories.length;
    // largura da barra
    const barWidth = range / this.series.length / 2;
    // proporcao do item com caterories length
    const ratioX = index / this.categories.length;
    // pontos x1 e x2 (inicial e final)

    // x1 = padding inicial  | proporção X | area de plotagem x | largura coluna \ 4 | largura da barra por serie
    const x1 = Padding * 3 + ratioX * (this.svgWidth - Padding * 4) + range / 4 + barWidth * serieIndex;
    const x2 = x1 + barWidth;

    // pontos y1 e y2 (inicial e final)
    const ratioY = dataValue / this.maxValue;
    const y1 = this.svgInternalAreaHeight + Padding;
    const y2 = this.svgInternalAreaHeight - this.svgInternalAreaHeight * ratioY + Padding;

    console.log('dataValue', dataValue);
    console.log('maxValue', this.maxValue);
    console.log('ratioY', ratioY);
    console.log('svgInternalAreaHeight', this.svgInternalAreaHeight);
    console.log('this.svgInternalAreaHeight * ratioY', this.svgInternalAreaHeight * ratioY);

    const pathCoordinates = ['M', x1, y2, 'L', x2, y2, 'L', x2, y1, 'L', x1, y1, 'z'].join(' ');

    console.log('pathCoordinates', pathCoordinates);
    // const pathCoordinates = [
    //   'M',
    //   x1,
    //   y1,
    //   'v',
    //   -y2
    // ].join(' ');

    // const pathCoordinates = [
    //   'M',
    //   x1,
    //   y1,
    //   'l',
    //   x1,
    //   y2,
    //   'l',
    //   x2,
    //   y2,
    //   'l',
    //   x2,
    //   y1,
    //   'z'
    // ].join(' ');

    return pathCoordinates;
    return `M 100 100 l 0 100 l 200 0 l 0 -200 z`;

    // <path d="M150 0 L75 200 L225 200 Z" />

    // const pathCoordinates = [
    //   'M',
    //   startX,
    //   startY,
    //   'A',
    //   this.centerX,
    //   this.centerX,
    //   0,
    //   largeArc ? '1,1' : '0,1',
    //   endX,
    //   endY,
    //   'L',
    //   endInnerX,
    //   endInnerY,
    //   'A',
    //   this.innerRadius,
    //   this.innerRadius,
    //   0,
    //   largeArc ? '1,0' : '0,0',
    //   startInnerX,
    //   startInnerY,
    //   'Z'
    // ].join(' ');

    // d=”M 100 100 l 0 100 l 200 0 l 0 -200 z"
  }

  // calculateAxisYLabelsPoints(axisLabel, index) {
  //   const textPadding = 8;

  //   const yCoordinate = this.svgHeight - textPadding;

  //   const ratio = index / (this.categories.length);

  //   // calculo para o range, importante
  //   const range  = (this.svgWidth - Padding * 4) / this.categories.length

  //   const xCoordinate = ((Padding * 3) + ratio * (this.svgWidth - Padding * 4)) + (range / 2);

  //   return [xCoordinate.toString(), yCoordinate.toString()];
  // }
}
