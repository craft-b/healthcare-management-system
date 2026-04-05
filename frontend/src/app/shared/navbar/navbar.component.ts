import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid px-4">
        <a class="navbar-brand fw-bold" routerLink="/dashboard">
          <i class="bi bi-hospital me-2"></i>HMS
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="bi bi-speedometer2 me-1"></i>Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/appointments" routerLinkActive="active">
                <i class="bi bi-calendar-check me-1"></i>Appointments
              </a>
            </li>
            @if (auth.role === 'PATIENT') {
              <li class="nav-item">
                <a class="nav-link" routerLink="/patients" routerLinkActive="active">
                  <i class="bi bi-person-lines-fill me-1"></i>My Profile
                </a>
              </li>
            }
            @if (auth.role === 'PROVIDER' || auth.role === 'ADMIN') {
              <li class="nav-item">
                <a class="nav-link" routerLink="/patients" routerLinkActive="active">
                  <i class="bi bi-people me-1"></i>Patients
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/prescriptions" routerLinkActive="active">
                  <i class="bi bi-prescription2 me-1"></i>Prescriptions
                </a>
              </li>
            }
            @if (auth.role === 'PATIENT' || auth.role === 'ADMIN') {
              <li class="nav-item">
                <a class="nav-link" routerLink="/billing" routerLinkActive="active">
                  <i class="bi bi-receipt me-1"></i>Billing
                </a>
              </li>
            }
            @if (auth.role === 'ADMIN') {
              <li class="nav-item">
                <a class="nav-link" routerLink="/reports" routerLinkActive="active">
                  <i class="bi bi-bar-chart-line me-1"></i>Reports
                </a>
              </li>
            }
          </ul>
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i>
                {{ auth.currentUser()?.fullName }}
                <span class="badge bg-light text-primary ms-1">{{ auth.role }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <button class="dropdown-item text-danger" (click)="auth.logout()">
                    <i class="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
