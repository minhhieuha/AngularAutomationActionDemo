import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('angular-app');
  username = signal('');
  password = signal('');
  isLoggedIn = signal(false);
  errorMessage = signal('');

  signIn() {
    // Demo validation
    if (this.username() === 'admin' && this.password() === 'admin123') {
      this.isLoggedIn.set(true);
      this.errorMessage.set('');
    } else {
      this.errorMessage.set('Invalid username or password');
    }
  }

  signOut() {
    this.isLoggedIn.set(false);
    this.username.set('');
    this.password.set('');
  }
}
