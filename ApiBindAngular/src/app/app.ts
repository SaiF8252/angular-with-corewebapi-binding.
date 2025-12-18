// app.ts
import { Component, signal } from '@angular/core';
import { AuthService, LoggedIn, UserName } from './services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
  
})
export class App {
  loggedIn = LoggedIn; // signal<boolean>
  name = UserName;     // signal<string | null>

  constructor(public auth: AuthService) { }
}
