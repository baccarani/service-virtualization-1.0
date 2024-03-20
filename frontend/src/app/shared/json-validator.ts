import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function jsonValidator(): ValidatorFn {
  return (control: AbstractControl) : ValidationErrors | null => {
    const value = control.value;
    if (!value) {
        return null;
    }

    try {
      JSON.parse(value);
    } catch (e) {
      return { invalidJson: true };
    }
  }
}