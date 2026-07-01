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
