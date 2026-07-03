# Step 5: Submit + disable while invalid

Slides: Part 7 (submit, disable while invalid).
Goal: handle submit, guard on valid(), read the typed value off the form, show a success
alert, and add a reset. This completes the signup form.

## FILE: src/app/signup-form/signup-form.ts
```ts
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
  signupModel = signal<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  signupForm = form(this.signupModel, (schema) => {
    required(schema.email, { message: 'Email is required.' });
    email(schema.email, { message: 'Enter a valid email address.' });

    required(schema.password, { message: 'Password is required.' });
    minLength(schema.password, 8, { message: 'Use at least 8 characters.' });

    required(schema.confirmPassword, { message: 'Please confirm your password.' });
    validate(schema.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(schema.password)) {
        return { kind: 'passwordMismatch', message: 'Passwords do not match.' };
      }
      return null;
    });
  });

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
    effect(() => {
      const value = this.signupForm().value();
      console.log('form changed:', value);
    });
  }

  // Submit: guard on valid(), read the typed value off the form.
  onSubmit() {
    if (this.signupForm().valid()) {
      this.submitted.set(this.signupForm().value());
    }
  }

  reset() {
    this.signupForm().reset({ email: '', password: '', confirmPassword: '' })
    this.submitted.set(null);
  }
}
```

## FILE: src/app/signup-form/signup-form.html
```html
<div class="card bg-base-200 w-full max-w-md shadow-xl mx-auto">
  <div class="card-body">
    <h2 class="card-title">Create your account</h2>
    <p class="text-sm opacity-70 mb-2">Signal Forms, no ControlValueAccessor.</p>

    <form (submit)="onSubmit(); $event.preventDefault()" class="flex flex-col gap-4">
      <!-- Email -->
      <div class="form-control w-full">
        <label class="label" for="email"><span class="label-text font-semibold">Email</span></label>
        <input id="email" type="email" [formField]="signupForm.email" class="input input-bordered w-full" placeholder="you@example.com" />
        @if (signupForm.email().touched() && signupForm.email().invalid()) {
          <div class="mt-1">
            @for (error of signupForm.email().errors(); track error.kind) {
              <span class="label-text-alt text-error block">{{ error.message }}</span>
            }
          </div>
        }
      </div>

      <!-- Password -->
      <div class="form-control w-full">
        <label class="label" for="password"><span class="label-text font-semibold">Password</span></label>
        <input id="password" type="password" [formField]="signupForm.password" class="input input-bordered w-full" placeholder="At least 8 characters" />
        @if (signupForm.password().value().length > 0) {
          <div class="mt-2">
            <progress
              class="progress w-full"
              [class.progress-error]="passwordStrength() <= 1"
              [class.progress-warning]="passwordStrength() === 2"
              [class.progress-success]="passwordStrength() >= 3"
              [value]="passwordStrength()"
              max="4"
            ></progress>
            <span class="label-text-alt opacity-70">Strength: {{ strengthLabel() }}</span>
          </div>
        }
        @if (signupForm.password().touched() && signupForm.password().invalid()) {
          <div class="mt-1">
            @for (error of signupForm.password().errors(); track error.kind) {
              <span class="label-text-alt text-error block">{{ error.message }}</span>
            }
          </div>
        }
      </div>

      <!-- Confirm password (cross-field) -->
      <div class="form-control w-full">
        <label class="label" for="confirmPassword"><span class="label-text font-semibold">Confirm password</span></label>
        <input id="confirmPassword" type="password" [formField]="signupForm.confirmPassword" class="input input-bordered w-full" placeholder="Repeat your password" />
        @if (signupForm.confirmPassword().touched() && signupForm.confirmPassword().invalid()) {
          <div class="mt-1">
            @for (error of signupForm.confirmPassword().errors(); track error.kind) {
              <span class="label-text-alt text-error block">{{ error.message }}</span>
            }
          </div>
        }
      </div>

      <button type="submit" class="btn btn-primary btn-block" [disabled]="signupForm().invalid()">
        Sign up
      </button>
    </form>

    @if (submitted(); as data) {
      <div class="alert alert-success mt-4">
        <span>Welcome, {{ data.email }}! Your account is ready.</span>
      </div>
      <button class="btn btn-ghost btn-sm mt-2" (click)="reset()">Reset</button>
    }

    <div class="mockup-code text-xs mt-4">
      <pre><code>{{ signupForm().value() | json }}</code></pre>
    </div>
  </div>
</div>
```

## Explanation (write verbatim to STEP-5-EXPLAINED.md)
```md
# Step 5: Submit

- The button is disabled on `signupForm().invalid()`, so a broken form cannot submit.
- `onSubmit()` guards on `signupForm().valid()`, then reads the fully typed `signupForm().value()`.
- On success we store the value and show an alert; `reset()` sets the model signal back to empty.
- For real async submits, the `submit(form, action)` helper handles pending state and touched marking.

Try it: fill every field validly, submit, see the welcome alert, then reset.
```
