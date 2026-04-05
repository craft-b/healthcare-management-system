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
      <div class="card auth-card shadow">
        <div class="auth-logo">
          <i class="bi bi-hospital-fill"></i>
          <h4>Create an Account</h4>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="mb-3">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" formControlName="fullName" placeholder="Enter full name" />
            @if (form.get('fullName')?.touched && form.get('fullName')?.invalid) {
              <div class="text-danger small mt-1">Full name is required.</div>
            }
          </div>
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" class="form-control" formControlName="username" placeholder="Choose a username" />
            @if (form.get('username')?.touched && form.get('username')?.invalid) {
              <div class="text-danger small mt-1">Username is required.</div>
            }
          </div>
          <div class="mb-3">
            <label class="form-label">Email <span class="text-muted">(optional)</span></label>
            <input type="email" class="form-control" formControlName="email" placeholder="Enter email" />
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" formControlName="password" placeholder="Choose a password" />
            @if (form.get('password')?.touched && form.get('password')?.invalid) {
              <div class="text-danger small mt-1">Password must be at least 6 characters.</div>
            }
          </div>
          <div class="mb-3">
            <label class="form-label">Role</label>
            <select class="form-select" formControlName="role">
              <option value="PATIENT">Patient</option>
              <option value="PROVIDER">Healthcare Provider</option>
            </select>
          </div>
          @if (error) {
            <div class="alert alert-danger py-2">{{ error }}</div>
          }
          <div class="d-grid mb-3">
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              @if (loading) {
                <span class="spinner-border spinner-border-sm me-2"></span>
              }
              Register
            </button>
          </div>
          <div class="text-center">
            <small>Already have an account? <a routerLink="/login">Login</a></small>
          </div>
        </form>
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.error = 'Registration failed. Username may already be taken.';
        this.loading = false;
      }
    });
  }
}
