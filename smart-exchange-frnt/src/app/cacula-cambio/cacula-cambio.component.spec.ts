import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaculaCambioComponent } from './cacula-cambio.component';

describe('CaculaCambioComponent', () => {
  let component: CaculaCambioComponent;
  let fixture: ComponentFixture<CaculaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaculaCambioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaculaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
