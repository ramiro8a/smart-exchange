import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-cacula-cambio',
  templateUrl: './cacula-cambio.component.html',
  styleUrls: ['./cacula-cambio.component.sass']
})
export class CaculaCambioComponent {
  compraFormGroup = this.formBuilder.group({
    dolares: [0, Validators.required],
    soles: [0],
  });
  ventaFormGroup = this.formBuilder.group({
    soles: [0, Validators.required],
    dolares: [0]
  });

  constructor(private formBuilder: FormBuilder) {}
}
