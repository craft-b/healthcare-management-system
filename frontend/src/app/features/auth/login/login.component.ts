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
      <div class="auth-panel-left">
        <div class="auth-brand"><i class="bi bi-hospital-fill"></i> HMS</div>
        <p class="auth-tagline">Comprehensive healthcare management<br>for patients and providers.</p>
        <ul class="auth-features">
          <li><i class="bi bi-shield-check"></i> HIPAA-compliant &amp; secure</li>
          <li><i class="bi bi-calendar-check"></i> Easy appointment scheduling</li>
          <li><i class="bi bi-prescription2"></i> Digital prescription management</li>
          <li><i class="bi bi-receipt"></i> Streamlined billing &amp; claims</li>
        </ul>
      </div>
      <div class="auth-panel-right">
        <div class="auth-form-card">
          <h2>Welcome back</h2>
          <p class="subtitle">Sign in to your HMS account</p>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" formControlName="username" placeholder="Enter your username" autocomplete="username" />
              @if (form.get('username')?.touched && form.get('username')?.invalid) {
                <span class="field-error">Username is required.</span>
              }
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" formControlName="password" placeholder="Enter your password" autocomplete="current-password" />
              @if (form.get('password')?.touched && form.get('password')?.invalid) {
                <span class="field-error">Password is required.</span>
              }
            </div>
            @if (error) {
              <div class="alert alert-danger"><i class="bi bi-exclamation-circle-fill"></i>{{ error }}</div>
            }
            <button type="submit" class="btn btn-primary btn-block btn-lg mb-3" [disabled]="loading">
              @if (loading) { <span class="spinner" style="width:18px;height:18px;border-width:2px"></span> }
              Sign In
            </button>
            <p style="text-align:center;color:var(--muted);font-size:.875rem;margin:0">
              No account? <a routerLink="/register" style="color:var(--navy);font-weight:600">Create one</a>
            </p>
          </form>
          <div style="margin-top:2rem;padding:1rem;background:#f0f4fb;border-radius:10px">
            <p style="margin:0 0 .5rem;font-size:.75rem;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.05em">Demo Accounts</p>
            <div style="display:grid;gap:.2rem;font-size:.8rem;color:var(--muted)">
              <span><b style="color:var(--text)">admin</b> / admin123</span>
              <span><b style="color:var(--text)">dr.smith</b> / doctor123</span>
              <span><b style="color:var(--text)">john.doe</b> / patient123</span>
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
    this.form = this.fb.group({ username: ['', Validators.required], password: ['', Validators.required] });
  }
  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Invalid username or password.'; this.loading = false; }
    });
  }
}
