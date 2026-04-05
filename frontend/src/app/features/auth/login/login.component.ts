import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="card auth-card shadow">
        <div class="auth-logo">
          <i class="bi bi-hospital-fill"></i>
          <h4>Healthcare Management System</h4>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" class="form-control" formControlName="username" placeholder="Enter username" />
            @if (form.get('username')?.touched && form.get('username')?.invalid) {
              <div class="text-danger small mt-1">Username is required.</div>
            }
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" formControlName="password" placeholder="Enter password" />
            @if (form.get('password')?.touched && form.get('password')?.invalid) {
              <div class="text-danger small mt-1">Password is required.</div>
            }
          </div>
          @if (error) {
            <div class="alert alert-danger py-2">{{ error }}</div>
          }
          <div class="d-grid mb-3">
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              @if (loading) {
                <span class="spinner-border spinner-border-sm me-2"></span>
              }
              Login
            </button>
          </div>
          <div class="text-center">
            <small>Don't have an account? <a routerLink="/register">Register</a></small>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error = 'Invalid username or password.';
        this.loading = false;
      }
    });
  }
}
