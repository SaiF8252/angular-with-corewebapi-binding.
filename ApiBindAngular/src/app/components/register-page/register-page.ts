import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Register } from '../../models/register';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: false,
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css'], // <-- fixed here
})
export class RegisterPage {
  model = signal<Register>(new Register());

  constructor(private auth: AuthService, private router: Router) { }

  FormSubmit() {
    if (this.model().password !== this.model().comparePassword) {
      alert("Passwords do not match");
      return;
    }

    this.auth.Register(this.model()).subscribe(
      (res: any) => {
        alert('Registration successful!');
        this.router.navigate(['/login']); // make sure route exists
      },
      (error: any) => {
        console.error(error);
        alert('Registration failed. Check console.');
      }
    );
  }
}
