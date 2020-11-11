import { PoChartColorService } from '../../services/po-chart-color.service';
import { PoChartMathsService } from '../../services/po-chart-maths.service';

import { PoChartBarBaseComponent } from './po-chart-bar-base.component';

class PoChartColumnComponent extends PoChartBarBaseComponent {
  barCoordinates() {}
}

describe('PoChartBarBaseComponent', () => {
  const colorService: PoChartColorService = new PoChartColorService();
  const mathsService: PoChartMathsService = new PoChartMathsService();
  const component: PoChartColumnComponent = new PoChartColumnComponent(colorService, mathsService);

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
