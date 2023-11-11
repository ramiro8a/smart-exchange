import { Component } from '@angular/core';
import { FormBuilder, NgForm ,FormGroup, Validators,FormsModule, FormControl,ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-registrate',
  templateUrl: './registrate.component.html',
  styleUrls: ['./registrate.component.sass']
})
export class RegistrateComponent {
  hide: boolean= true
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
    ){
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  executeAction(daat:string){

  }
}
