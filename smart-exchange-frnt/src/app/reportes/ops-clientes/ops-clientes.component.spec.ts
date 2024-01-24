import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsClientesComponent } from './ops-clientes.component';

describe('OpsClientesComponent', () => {
  let component: OpsClientesComponent;
  let fixture: ComponentFixture<OpsClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpsClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpsClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
