import { Component, computed, effect, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  form,
  FormField,
  required,
  email,
  minLength,
  validate,
} from '@angular/forms/signals';

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-signup-form',
  imports: [FormField, JsonPipe],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm {
  // 1. Form state is just a signal.
  signupModel = signal<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 2. form() wraps the signal; the schema declares the rules.
  signupForm = form(this.signupModel, (schema) => {
    // 3. Built-in validators.
    required(schema.email, { message: 'Email is required.' });
    email(schema.email, { message: 'Enter a valid email address.' });

    required(schema.password, { message: 'Password is required.' });
    minLength(schema.password, 8, {
      message: 'Use at least 8 characters.',
    });

    // 6. Cross-field validation: confirm password must match password.
    required(schema.confirmPassword, { message: 'Please confirm your password.' });
    validate(schema.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(schema.password)) {
        return { kind: 'passwordMismatch', message: 'Passwords do not match.' };
      }
      return null;
    });
  });

  // 5. Watching changes, signals-native. No valueChanges subscription.
  passwordStrength = computed(() => {
    const value = this.signupForm.password().value();
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score; // 0..4
  });

  strengthLabel = computed(
    () => ['Too weak', 'Weak', 'Okay', 'Good', 'Strong'][this.passwordStrength()],
  );

  submitted = signal<SignupData | null>(null);

  constructor() {
    // effect() reacts to any change in the form value.
    effect(() => {
      const value = this.signupForm().value();
      console.log('form changed:', value);
    });
  }

  // 7. Submit: guard on valid(), read the typed value off the form.
  onSubmit() {
    if (this.signupForm().valid()) {
      this.submitted.set(this.signupForm().value());
    }
  }

  reset() {
    this.submitted.set(null);
    this.signupModel.set({ email: '', password: '', confirmPassword: '' });
  }
}
