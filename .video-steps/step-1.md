# Step 1: The form signal + [formField] binding

Slides: Parts 1 and 2 (the form signal, form(), [formField], value()).
Goal: a first working signup form. State is a signal, inputs bind with [formField], and a
live JSON preview proves the model stays in sync. No validation yet.

## FILE: src/app/signup-form/signup-form.ts
```ts
import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField } from '@angular/forms/signals';

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
  // Form state is just a signal. This is the single source of truth.
  signupModel = signal<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // form() wraps the signal and gives us a field tree. No schema yet.
  signupForm = form(this.signupModel);
}
```

## FILE: src/app/signup-form/signup-form.html
```html
<div class="card bg-base-200 w-full max-w-md shadow-xl mx-auto">
  <div class="card-body">
    <h2 class="card-title">Create your account</h2>
    <p class="text-sm opacity-70 mb-2">Signal Forms, no ControlValueAccessor.</p>

    <form class="flex flex-col gap-4">
      <div class="form-control w-full">
        <label class="label" for="email"><span class="label-text font-semibold">Email</span></label>
        <input id="email" type="email" [formField]="signupForm.email" class="input input-bordered w-full" placeholder="you@example.com" />
      </div>

      <div class="form-control w-full">
        <label class="label" for="password"><span class="label-text font-semibold">Password</span></label>
        <input id="password" type="password" [formField]="signupForm.password" class="input input-bordered w-full" placeholder="At least 8 characters" />
      </div>

      <div class="form-control w-full">
        <label class="label" for="confirmPassword"><span class="label-text font-semibold">Confirm password</span></label>
        <input id="confirmPassword" type="password" [formField]="signupForm.confirmPassword" class="input input-bordered w-full" placeholder="Repeat your password" />
      </div>
    </form>

    <!-- Live value() preview: the model updates as you type -->
    <div class="mockup-code text-xs mt-4">
      <pre><code>{{ signupForm().value() | json }}</code></pre>
    </div>
  </div>
</div>
```

## Explanation (write verbatim to STEP-1-EXPLAINED.md)
```md
# Step 1: The form signal

- `signupModel = signal({...})` holds the form data. That is the whole state.
- `signupForm = form(this.signupModel)` wraps it into a field tree.
- `[formField]="signupForm.email"` two-way binds an input. No ControlValueAccessor.
- `signupForm().value()` reads the live value; the JSON preview updates as you type.

Try it: type in any field and watch the JSON preview change.
```
