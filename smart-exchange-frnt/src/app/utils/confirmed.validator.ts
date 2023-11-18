import { FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ConfirmPasswordValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);
  
      if (!control || !matchingControl) {
        console.error('Form controls can not be found in the form group');
        return { controlNotFound: false };
      }
  
      const error = control.value !== matchingControl.value ? { confirmPasswordValidator: true } : null;
      matchingControl.setErrors(error);
      return error;
    };
  }
  
