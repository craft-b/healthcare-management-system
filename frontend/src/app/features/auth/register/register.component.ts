import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-panel-left">
        <div class="auth-brand"><i class="bi bi-hospital-fill"></i> HMS</div>
        <p class="auth-tagline">Join our healthcare platform and manage your health journey with ease.</p>
        <ul class="auth-features">
          <li><i class="bi bi-person-check"></i> Patients &mdash; manage records &amp; appointments</li>
          <li><i class="bi bi-heart-pulse"></i> Providers &mdash; manage patients &amp; prescriptions</li>
          <li><i class="bi bi-lock"></i> Secure, encrypted health data</li>
          <li><i class="bi bi-bell"></i> Appointment reminders &amp; notifications</li>
        </ul>
      </div>
      <div class="auth-panel-right">
        <div class="auth-form-card">
          <h2>Create account</h2>
          <p class="subtitle">Get started with HMS today</p>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" formControlName="fullName" placeholder="Your full name" />
              @if (form.get('fullName')?.touched && form.get('fullName')?.invalid) {
                <span class="field-error">Full name is required.</span>
              }
            </div>
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" formControlName="username" placeholder="Choose a username" autocomplete="username" />
              @if (form.get('username')?.touched && form.get('username')?.invalid) {
                <span class="field-error">Username is required.</span>
              }
            </div>
            <div class="mb-3">
              <label class="form-label">Email <span style="color:var(--muted);font-weight:400">(optional)</span></label>
              <input type="email" class="form-control" formControlName="email" placeholder="your@email.com" />
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" formControlName="password" placeholder="At least 6 characters" autocomplete="new-password" />
              @if (form.get('password')?.touched && form.get('password')?.invalid) {
                <span class="field-error">Password must be at least 6 characters.</span>
              }
            </div>
            <div class="mb-3">
              <label class="form-label">I am a...</label>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-top:.25rem">
                <label style="display:flex;align-items:center;gap:.6rem;padding:.75rem 1rem;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;transition:all .18s"
                       [style.border-color]="form.get('role')?.value==='PATIENT'?'var(--navy)':'var(--border)'"
                       [style.background]="form.get('role')?.value==='PATIENT'?'var(--navy-light)':'#fff'">
                  <input type="radio" formControlName="role" value="PATIENT" style="accent-color:var(--navy)" />
                  <span style="font-weight:600;font-size:.875rem;color:var(--navy)"><i class="bi bi-person me-1"></i>Patient</span>
                </label>
                <label style="display:flex;align-items:center;gap:.6rem;padding:.75rem 1rem;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;transition:all .18s"
                       [style.border-color]="form.get('role')?.value==='PROVIDER'?'var(--navy)':'var(--border)'"
                       [style.background]="form.get('role')?.value==='PROVIDER'?'var(--navy-light)':'#fff'">
                  <input type="radio" formControlName="role" value="PROVIDER" style="accent-color:var(--navy)" />
                  <span style="font-weight:600;font-size:.875rem;color:var(--navy)"><i class="bi bi-heart-pulse me-1"></i>Provider</span>
                </label>
              </div>
            </div>
            @if (error) {
              <div class="alert alert-danger"><i class="bi bi-exclamation-circle-fill"></i>{{ error }}</div>
            }
            <button type="submit" class="btn btn-primary btn-block btn-lg mb-3" [disabled]="loading">
              @if (loading) { <span class="spinner" style="width:18px;height:18px;border-width:2px"></span> }
              Create Account
            </button>
            <p style="text-align:center;color:var(--muted);font-size:.875rem;margin:0">
              Already have an account? <a routerLink="/login" style="color:var(--navy);font-weight:600">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['PATIENT', Validators.required]
    });
  }
  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Registration failed. Username may already be taken.'; this.loading = false; }
    });
  }
}
