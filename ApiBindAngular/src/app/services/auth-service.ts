import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { Register } from '../models/register';
import { Router } from '@angular/router';

export const tokenKey = "jwt_token";

// Signals
export const LoggedIn = signal<boolean>(false);
export const UserName = signal<string | null>(null);

@Injectable({ providedIn: 'root' })
export class AuthService {

  api: string = "http://localhost:5000/api/Token";

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromLocalStorage(); // 🔹 page refresh fix
  }

  Login(model: Login) {
    return this.http.post(`${this.api}/login`, model, { responseType: 'text' });
  }

  Register(model: Register) {
    const body = {
      UserName: model.userName,
      Password: model.password
    };
    return this.http.post(`${this.api}/register`, body);
  }

  saveToken(token: string, name: string) {
    localStorage.setItem(tokenKey, token);
    localStorage.setItem("name", name);
    LoggedIn.set(true);
    UserName.set(name);
  }

  Logout() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem("name");
    LoggedIn.set(false);
    UserName.set(null);
    this.router.navigate(['login'])
  }

  get Token(): string | null {
    return localStorage.getItem(tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.Token;
  }

  // 🔹 Page refresh fix: load signals from localStorage
  private loadFromLocalStorage() {
    const token = localStorage.getItem(tokenKey);
    const name = localStorage.getItem("name");
    if (token) {
      LoggedIn.set(true);
      UserName.set(name);
    } else {
      LoggedIn.set(false);
      UserName.set(null);
    }
  }
}
