import { Component } from '@angular/core';
import { FormBuilder, NgForm ,FormGroup, Validators,FormsModule, FormControl,ReactiveFormsModule } from '@angular/forms'
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  private readonly notifier: NotifierService;
  loginForm: FormGroup;
  hide: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private notifierService: NotifierService
    ){
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
      this.notifier = notifierService;
  }

  executeAction(daat:string){
    
    
  }

  panelManager(daat:string){

  }

}
