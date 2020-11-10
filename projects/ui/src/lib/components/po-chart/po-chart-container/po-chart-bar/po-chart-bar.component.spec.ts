import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartBarBaseComponent } from './po-chart-bar-base.component';

describe('PoChartBarBaseComponent', () => {
  let component: PoChartBarBaseComponent;
  let fixture: ComponentFixture<PoChartBarBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartBarBaseComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartBarBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
