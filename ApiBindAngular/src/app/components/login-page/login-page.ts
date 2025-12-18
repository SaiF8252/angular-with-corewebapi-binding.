import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { Login } from '../../models/login';
import { ValidationHelper } from '../../services/validation-helper';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
})
export class LoginPage {
  model = signal<Login>(new Login());

  constructor(private auth: AuthService, private router: Router, public ValidationHelper: ValidationHelper) { }

  FormSubmit() {
    this.auth.Login(this.model()).subscribe(
      (token: string) => {
        // backend থেকে JWT string আসছে
        this.auth.saveToken(token, this.model().userName); 
        console.info(`Token: ${token}`);
        this.router.navigate(['index']); 
      },
      (error: any) => {
        console.error(error);
        alert('Login failed. Check console.');
      }
    );
  }
}
