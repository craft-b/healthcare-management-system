import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthRequest, AuthResponse, RegisterRequest, Role } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'hms_token';
  private readonly USER_KEY = 'hms_user';

  currentUser = signal<AuthResponse | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(req: AuthRequest) {
    return this.http.post<AuthResponse>(`${this.API}/login`, req).pipe(
      tap(res => this.saveSession(res))
    );
  }

  register(req: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.API}/register`, req).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get role(): Role | null {
    return this.currentUser()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    this.currentUser.set(res);
  }

  private loadUser(): AuthResponse | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
