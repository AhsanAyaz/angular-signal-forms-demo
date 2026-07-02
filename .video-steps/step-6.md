# Step 6: Nested fields + arrays (bonus)

Slides: Part 8 (nested and array fields).
Goal: build the Profile form. Nested objects use dot paths; arrays use applyEach. Add and
remove items by updating the model signal. After this, the app equals the finished project.

## FILE: src/app/profile-form/profile-form.ts
```ts
import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  form,
  FormField,
  required,
  minLength,
  applyEach,
} from '@angular/forms/signals';

interface ProfileData {
  name: string;
  address: {
    city: string;
    country: string;
  };
  skills: { name: string }[];
}

@Component({
  selector: 'app-profile-form',
  imports: [FormField, JsonPipe],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css',
})
export class ProfileForm {
  // Nested objects and arrays are just data in the signal.
  profileModel = signal<ProfileData>({
    name: '',
    address: { city: '', country: '' },
    skills: [{ name: '' }],
  });

  profileForm = form(this.profileModel, (schema) => {
    required(schema.name, { message: 'Name is required.' });

    // Nested fields use dot notation.
    required(schema.address.city, { message: 'City is required.' });
    required(schema.address.country, { message: 'Country is required.' });

    // applyEach runs a schema for every item in the array.
    applyEach(schema.skills, (skill) => {
      required(skill.name, { message: 'Skill cannot be empty.' });
      minLength(skill.name, 2, { message: 'At least 2 characters.' });
    });
  });

  saved = signal<ProfileData | null>(null);

  // Arrays are mutated immutably on the model signal, no FormArray API.
  addSkill() {
    this.profileModel.update((model) => ({
      ...model,
      skills: [...model.skills, { name: '' }],
    }));
  }

  removeSkill(index: number) {
    this.profileModel.update((model) => ({
      ...model,
      skills: model.skills.filter((_, i) => i !== index),
    }));
  }

  onSubmit() {
    if (this.profileForm().valid()) {
      this.saved.set(this.profileForm().value());
    }
  }
}
```

## FILE: src/app/profile-form/profile-form.html
```html
<div class="card bg-base-200 w-full max-w-md shadow-xl mx-auto">
  <div class="card-body">
    <h2 class="card-title">Your profile</h2>
    <p class="text-sm opacity-70 mb-2">Nested fields and arrays are just data.</p>

    <form (submit)="onSubmit(); $event.preventDefault()" class="flex flex-col gap-4">
      <!-- Name -->
      <div class="form-control w-full">
        <label class="label" for="name">
          <span class="label-text font-semibold">Name</span>
        </label>
        <input id="name" type="text" [formField]="profileForm.name" class="input input-bordered w-full" />
        @if (profileForm.name().touched() && profileForm.name().invalid()) {
          @for (error of profileForm.name().errors(); track error.kind) {
            <span class="label-text-alt text-error block mt-1">{{ error.message }}</span>
          }
        }
      </div>

      <!-- Nested address -->
      <div class="grid grid-cols-2 gap-3">
        <div class="form-control w-full">
          <label class="label" for="city"><span class="label-text font-semibold">City</span></label>
          <input id="city" type="text" [formField]="profileForm.address.city" class="input input-bordered w-full" />
          @if (profileForm.address.city().touched() && profileForm.address.city().invalid()) {
            <span class="label-text-alt text-error block mt-1">City is required.</span>
          }
        </div>
        <div class="form-control w-full">
          <label class="label" for="country"><span class="label-text font-semibold">Country</span></label>
          <input id="country" type="text" [formField]="profileForm.address.country" class="input input-bordered w-full" />
          @if (profileForm.address.country().touched() && profileForm.address.country().invalid()) {
            <span class="label-text-alt text-error block mt-1">Country is required.</span>
          }
        </div>
      </div>

      <!-- Array of skills via applyEach -->
      <div class="form-control w-full">
        <span class="label-text font-semibold mb-1">Skills</span>
        @for (skill of profileForm.skills; track $index) {
          <div class="flex items-center gap-2 mb-2">
            <input type="text" [formField]="skill.name" class="input input-bordered w-full" placeholder="e.g. Angular" />
            <button
              type="button"
              class="btn btn-square btn-ghost"
              (click)="removeSkill($index)"
              [disabled]="profileModel().skills.length === 1"
              aria-label="Remove skill"
            >
              &times;
            </button>
          </div>
          @if (skill.name().touched() && skill.name().invalid()) {
            @for (error of skill.name().errors(); track error.kind) {
              <span class="label-text-alt text-error block -mt-1 mb-2">{{ error.message }}</span>
            }
          }
        }
        <button type="button" class="btn btn-outline btn-sm w-fit" (click)="addSkill()">+ Add skill</button>
      </div>

      <button type="submit" class="btn btn-primary btn-block" [disabled]="profileForm().invalid()">
        Save profile
      </button>
    </form>

    @if (saved(); as data) {
      <div class="alert alert-success mt-4">
        <span>Saved profile for {{ data.name }}.</span>
      </div>
    }

    <div class="mockup-code text-xs mt-4">
      <pre><code>{{ profileForm().value() | json }}</code></pre>
    </div>
  </div>
</div>
```

## Explanation (write verbatim to STEP-6-EXPLAINED.md)
```md
# Step 6: Nested + array fields

- Nested objects are dot paths in the schema: `schema.address.city`.
- `applyEach(schema.skills, skill => {...})` applies a schema to every array item.
- Arrays are plain data: add and remove with `signalModel.update(...)`, no FormArray.
- Bind array items in the template with `@for (skill of profileForm.skills; track $index)`.

Try it: open the Profile tab, add a skill, leave one blank, and watch per-item validation.
```
