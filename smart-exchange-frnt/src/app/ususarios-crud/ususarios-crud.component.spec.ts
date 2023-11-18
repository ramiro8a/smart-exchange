import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsusariosCrudComponent } from './ususarios-crud.component';

describe('UsusariosCrudComponent', () => {
  let component: UsusariosCrudComponent;
  let fixture: ComponentFixture<UsusariosCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsusariosCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsusariosCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
