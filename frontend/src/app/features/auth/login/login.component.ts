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

      <!-- Left brand panel -->
      <div class="auth-panel-left">
        <div class="auth-brand">
          <div class="auth-brand-icon"><i class="bi bi-hospital-fill"></i></div>
          <div>
            <div class="auth-brand-name">MedCore HMS</div>
            <div class="auth-brand-sub">Healthcare Management</div>
          </div>
        </div>

        <h1 class="auth-headline">
          Your health,<br><span>managed simply.</span>
        </h1>

        <p class="auth-tagline">
          One platform for patients, providers, and administrators
          to coordinate care with confidence.
        </p>

        <ul class="auth-features">
          <li><i class="bi bi-shield-check"></i>HIPAA-compliant &amp; secure</li>
          <li><i class="bi bi-calendar-check"></i>Easy appointment scheduling</li>
          <li><i class="bi bi-prescription2"></i>Digital prescription management</li>
          <li><i class="bi bi-receipt"></i>Streamlined billing &amp; insurance claims</li>
        </ul>
      </div>

      <!-- Right form panel -->
      <div class="auth-panel-right">
        <div class="auth-form-card">
          <h2>Welcome back</h2>
          <p class="subtitle">Sign in to your account to continue</p>

          <form [formGroup]="form" (ngSubmit)="submit()">

            <div class="mb-2">
              <label class="form-label">Username</label>
              <div class="auth-input-wrap">
                <i class="bi bi-person"></i>
                <input type="text" class="form-control" formControlName="username"
                  placeholder="Enter your username" autocomplete="username" />
              </div>
              @if (form.get('username')?.touched && form.get('username')?.invalid) {
                <span class="field-error">Username is required.</span>
              }
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <div class="auth-input-wrap">
                <i class="bi bi-lock"></i>
                <input type="password" class="form-control" formControlName="password"
                  placeholder="Enter your password" autocomplete="current-password" />
              </div>
              @if (form.get('password')?.touched && form.get('password')?.invalid) {
                <span class="field-error">Password is required.</span>
              }
            </div>

            @if (error) {
              <div class="alert alert-danger"><i class="bi bi-exclamation-circle-fill"></i>{{ error }}</div>
            }

            <button type="submit" class="btn btn-primary btn-block btn-lg mb-3" [disabled]="loading">
              @if (loading) { <span class="spinner" style="width:18px;height:18px;border-width:2px;border-top-color:#fff;border-color:rgba(255,255,255,.3)"></span> }
              Sign In
            </button>

            <p style="text-align:center;color:var(--muted);font-size:.875rem;margin:0">
              New patient?
              <a routerLink="/register" style="font-weight:600">Create an account</a>
            </p>
          </form>

          <!-- Demo credentials -->
          <div style="margin-top:2rem;background:var(--brand-50);border:1px solid var(--brand-100);border-radius:10px;padding:1.1rem 1.25rem">
            <p style="margin:0 0 .6rem;font-size:.72rem;font-weight:700;color:var(--brand-600);text-transform:uppercase;letter-spacing:.07em">
              <i class="bi bi-info-circle"></i> Demo accounts
            </p>
            <div style="display:grid;gap:.3rem;font-size:.8rem;color:var(--muted)">
              <div style="display:flex;gap:.5rem;align-items:center">
                <span class="badge badge-navy">Admin</span>
                <code style="color:var(--text-2)">admin</code> / admin123
              </div>
              <div style="display:flex;gap:.5rem;align-items:center">
                <span class="badge badge-teal">Provider</span>
                <code style="color:var(--text-2)">dr.smith</code> / doctor123
              </div>
              <div style="display:flex;gap:.5rem;align-items:center">
                <span class="badge badge-success">Patient</span>
                <code style="color:var(--text-2)">john.doe</code> / patient123
              </div>
            </div>
          </div>

        </div>
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
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Invalid username or password.'; this.loading = false; }
    });
  }
}
