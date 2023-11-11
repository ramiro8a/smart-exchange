import { Component } from '@angular/core';
import { FormBuilder, NgForm ,FormGroup, Validators,FormsModule, FormControl,ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  loginForm: FormGroup;
  hide: boolean = true;
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

  panelManager(daat:string){

  }

}
