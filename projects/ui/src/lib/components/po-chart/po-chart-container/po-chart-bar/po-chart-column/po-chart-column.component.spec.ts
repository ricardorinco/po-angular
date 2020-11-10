import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartColumnComponent } from './po-chart-column.component';

describe('PoChartColumnComponent', () => {
  let component: PoChartColumnComponent;
  let fixture: ComponentFixture<PoChartColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartColumnComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
