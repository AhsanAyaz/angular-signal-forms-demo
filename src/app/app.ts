import { Component, signal } from '@angular/core';
import { SignupForm } from './signup-form/signup-form';
import { ProfileForm } from './profile-form/profile-form';

type Tab = 'signup' | 'profile';

@Component({
  selector: 'app-root',
  imports: [SignupForm, ProfileForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  tab = signal<Tab>('signup');

  select(tab: Tab) {
    this.tab.set(tab);
  }
}
