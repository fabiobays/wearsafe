import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function Html(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];       

        if (control.errors) {
            // return if another validator has already found an error on the control
            return;
        }

        let htmlRegex = new RegExp(/[<>/:&+%;\"]|\\.\\w{2,4}/);
        // set error on matchingControl if validation fails
        if (htmlRegex.test(control.value)) {
            control.setErrors({ html: true });
        } else {
            control.setErrors(null);
        }
    }
}