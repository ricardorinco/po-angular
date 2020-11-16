import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { PoChartPathCoordinates } from '../../../interfaces/po-chart-path-coordinates.interface';

const pathDashoffsetDefaultWidth = 0;

@Component({
  selector: '[po-chart-path]',
  templateUrl: './po-chart-path.component.svg'
})
export class PoChartPathComponent implements AfterViewInit {
  pathWidth: number;

  private _animate: boolean;

  @Input('p-color') color: string;

  @Input('p-animate') set animate(value: boolean) {
    this._animate = value;

    if (!this.animate) {
      this.pathWidth = pathDashoffsetDefaultWidth;
    }
  }

  get animate() {
    return this._animate;
  }

  @Input('p-coordinates') coordinates: PoChartPathCoordinates;

  @ViewChild('chartPath', { static: true }) chartPath: ElementRef;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.pathAnimation();
  }

  private pathAnimation() {
    this.pathWidth = this.animate ? this.chartPath.nativeElement.getTotalLength() : pathDashoffsetDefaultWidth;
    this.changeDetector.detectChanges();

    setTimeout(this.preventsAnimatingAgain.bind(this), 700);
  }

  // Redefine pathWidth para zero após o período da animação para que a linha se expanda normalmente on resize.
  private preventsAnimatingAgain() {
    this.pathWidth = pathDashoffsetDefaultWidth;
  }
}
