import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegOperadoresComponent } from './reg-operadores.component';

describe('RegOperadoresComponent', () => {
  let component: RegOperadoresComponent;
  let fixture: ComponentFixture<RegOperadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegOperadoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegOperadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
