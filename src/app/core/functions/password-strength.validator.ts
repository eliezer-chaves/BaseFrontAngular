import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const errors: ValidationErrors = {};

    // Verify if it has at least 1 uppercase letter
    if (!/(?=.*[A-Z])/.test(value)) {
      errors['uppercaseRequired'] = true;
    }

    // Verify if it has at least 1 lowercase letter
    if (!/(?=.*[a-z])/.test(value)) {
      errors['lowercaseRequired'] = true;
    }

    // Verify if it has at least 6 characters
    if (value.length < 6) {
      errors['minLength'] = { requiredLength: 6 };
    }

    // Verify if it has at least 1 special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors['specialCharRequired'] = true;
    }

    // Check for common sequences in the password
    const commonSequences = [
      // Direct numbers
      '000000', '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999',

      // Keyboard sequences
      'qwerty', 'qwert', 'qwertyuiop', 'asdfgh', 'asdfghjkl', 'zxcvbn', 'zxcvbnm',
      '1q2w3e', '1q2w3e4r', '1qaz2wsx', 'qazwsx', 'qazwsxedc', 'poiuyt', 'mnbvcxz',

      // Obvious English words
      'password', 'password1', 'password', 'admin', 'administrator', 'letmein', 'welcome', 'login', 'user', 'guest', 'default',
      'iloveyou', 'love', 'loveme', 'secret', 'test', 'testing', 'test',

      // Obvious Portuguese words
      'senha', 'minhasenha', 'senha', 'senha', 'admim', 'usuario', 'acesso', 'bemvindo',
    ];

    // Check if the password contains any common sequences 
    if (commonSequences.some(seq => value.toLowerCase().includes(seq))) {
      errors['commonSequence'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}