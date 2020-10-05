import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartBarComponent } from './po-chart-bar.component';

describe('PoChartBarComponent', () => {
  let component: PoChartBarComponent;
  let fixture: ComponentFixture<PoChartBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartBarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
