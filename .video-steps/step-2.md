# Step 2: Built-in validators + showing errors

Slides: Parts 3 and 4 (built-in validators, showing errors gated on touched()).
Goal: add required / email / minLength in the schema, show errors only after the field is
touched, and disable the submit button while the form is invalid.

## FILE: src/app/signup-form/signup-form.ts
```ts
import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';

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

  // Rules live in the schema, the second argument to form().
  signupForm = form(this.signupModel, (schema) => {
    required(schema.email, { message: 'Email is required.' });
    email(schema.email, { message: 'Enter a valid email address.' });

    required(schema.password, { message: 'Password is required.' });
    minLength(schema.password, 8, { message: 'Use at least 8 characters.' });
  });
}
```

## FILE: src/app/signup-form/signup-form.html
```html
<div class="card bg-base-200 w-full max-w-md shadow-xl mx-auto">
  <div class="card-body">
    <h2 class="card-title">Create your account</h2>
    <p class="text-sm opacity-70 mb-2">Signal Forms, no ControlValueAccessor.</p>

    <form (submit)="$event.preventDefault()" class="flex flex-col gap-4">
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
        @if (signupForm.password().touched() && signupForm.password().invalid()) {
          <div class="mt-1">
            @for (error of signupForm.password().errors(); track error.kind) {
              <span class="label-text-alt text-error block">{{ error.message }}</span>
            }
          </div>
        }
      </div>

      <!-- Confirm password (matching comes in step 4) -->
      <div class="form-control w-full">
        <label class="label" for="confirmPassword"><span class="label-text font-semibold">Confirm password</span></label>
        <input id="confirmPassword" type="password" [formField]="signupForm.confirmPassword" class="input input-bordered w-full" placeholder="Repeat your password" />
      </div>

      <button type="submit" class="btn btn-primary btn-block" [disabled]="signupForm().invalid()">
        Sign up
      </button>
    </form>

    <div class="mockup-code text-xs mt-4">
      <pre><code>{{ signupForm().value() | json }}</code></pre>
    </div>
  </div>
</div>
```

## Explanation (write verbatim to STEP-2-EXPLAINED.md)
```md
# Step 2: Validators + errors

- The schema is the second argument to `form(model, schema => {...})`.
- `required`, `email`, `minLength` each take a field path and an optional `{ message }`.
- Errors show only when `field().touched() && field().invalid()`, so they stay quiet until the user leaves the field.
- `errors()` is an array of `{ kind, message }`; the submit button is disabled on `signupForm().invalid()`.

Try it: focus the email, type "abc", blur. The error appears. Fix it and the button enables.
```
