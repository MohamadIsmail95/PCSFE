import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator to check if rangFrom is less than rangTo
export function rangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const rangFrom = group.get('rangFrom')?.value;
    const rangTo = group.get('rangTo')?.value;

    // Return an error if rangFrom is not less than rangTo
    return rangFrom !== null && rangTo !== null && rangFrom >= rangTo
      ? { invalidRange: true }
      : null;
  };
}
