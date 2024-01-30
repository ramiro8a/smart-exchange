import { FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ConfirmPasswordValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);
  
      if (!control || !matchingControl) {
        return { controlNotFound: false };
      }
  
      const error = control.value !== matchingControl.value ? { confirmPasswordValidator: true } : null;
      matchingControl.setErrors(error);
      return error;
    };
  }

export function ImporteValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = /^\d+(\.\d{0,4})?$/.test(control.value);
    return isValid ? null : { invalidDecimal: true };
  };
}
  
