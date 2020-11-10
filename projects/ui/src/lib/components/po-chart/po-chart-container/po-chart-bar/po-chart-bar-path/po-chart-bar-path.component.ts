import { Component, Input } from '@angular/core';

import { PoChartBarCoordinates } from '../../../interfaces/po-chart-bar-coordinates.interface';

@Component({
  selector: '[po-chart-bar-path]',
  templateUrl: './po-chart-bar-path.component.svg'
})
export class PoChartBarPathComponent {
  @Input('p-color') color?: string;

  @Input('p-coordinates') coordinates: PoChartBarCoordinates;

  constructor() {}

  trackBy(index) {
    return index;
  }
}
