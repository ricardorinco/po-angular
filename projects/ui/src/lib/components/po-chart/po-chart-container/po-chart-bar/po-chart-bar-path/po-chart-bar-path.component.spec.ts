import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartBarPathComponent } from './po-chart-bar-path.component';

describe('PoChartBarPathComponent', () => {
  let component: PoChartBarPathComponent;
  let fixture: ComponentFixture<PoChartBarPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartBarPathComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartBarPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
