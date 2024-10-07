import { AbstractControl, ValidatorFn, FormArray, ValidationErrors } from '@angular/forms';

// Custom validator for sequence validation
export function sequenceRangeValidator(): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    const controls = (formArray as FormArray).controls;

    for (let i = 1; i < controls.length; i++) {
      const prevGroup = controls[i - 1];
      const currentGroup = controls[i];

      const prevTo = prevGroup.get('rangTo')?.value;
      const currentFrom = currentGroup.get('rangFrom')?.value;

      // If previous 'rangTo' is not less than current 'rangFrom', return error
      if (prevTo !== null && currentFrom !== null && currentFrom != prevTo + 0.01) {
        return { invalidSequence: true }; // Invalid sequence detected
      }
    }

    return null; // If valid, return null (no errors)
  };
}
