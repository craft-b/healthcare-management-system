import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [`
    aside {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: 260px;
      background: var(--sidebar-bg);
      display: flex;
      flex-direction: column;
      z-index: 200;
      overflow-y: auto;
      overflow-x: hidden;
      border-right: 1px solid rgba(255,255,255,.04);
    }

    /* ── Brand ── */
    .brand {
      display: flex;
      align-items: center;
      gap: .85rem;
      padding: 1.4rem 1.25rem 1.1rem;
      text-decoration: none;
      border-bottom: 1px solid var(--sidebar-bdr);
      flex-shrink: 0;
    }

    .brand-icon {
      width: 38px; height: 38px;
      background: var(--sidebar-accent);
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 1.1rem;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(59,114,196,.4);
    }

    .brand-name {
      font-size: .9375rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -.02em;
      display: block;
      line-height: 1.2;
    }

    .brand-sub {
      font-size: .62rem;
      color: rgba(255,255,255,.38);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: .1em;
    }

    /* ── Nav ── */
    nav {
      flex: 1;
      padding: 1rem .875rem 0;
      display: flex;
      flex-direction: column;
    }

    .nav-section {
      font-size: .62rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .12em;
      color: rgba(255,255,255,.25);
      padding: 1.1rem .5rem .4rem;
    }

    .nav-section:first-child { padding-top: .25rem; }

    a.nav-item {
      display: flex;
      align-items: center;
      gap: .8rem;
      padding: .6rem .75rem;
      border-radius: 8px;
      color: var(--sidebar-text);
      font-size: .8375rem;
      font-weight: 500;
      text-decoration: none !important;
      transition: background .14s, color .14s;
      margin-bottom: 1px;
    }

    a.nav-item .nav-icon {
      width: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
      opacity: .7;
      transition: opacity .14s;
    }

    a.nav-item:hover {
      background: var(--sidebar-hover);
      color: rgba(255,255,255,.9);
    }

    a.nav-item:hover .nav-icon { opacity: 1; }

    a.nav-item.active {
      background: var(--sidebar-active);
      color: #fff;
      font-weight: 600;
    }

    a.nav-item.active .nav-icon {
      opacity: 1;
      color: rgba(147,197,253,1);
    }

    /* ── User footer ── */
    .sidebar-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--sidebar-bdr);
      flex-shrink: 0;
    }

    .user-row {
      display: flex;
      align-items: center;
      gap: .8rem;
    }

    .avatar {
      width: 36px; height: 36px;
      background: var(--sidebar-accent);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      font-size: .7rem;
      font-weight: 800;
      flex-shrink: 0;
      letter-spacing: -.02em;
    }

    .user-info { min-width: 0; flex: 1; }

    .user-name {
      font-size: .8125rem;
      font-weight: 700;
      color: rgba(255,255,255,.9);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
    }

    .user-role {
      font-size: .65rem;
      color: rgba(255,255,255,.38);
      text-transform: uppercase;
      letter-spacing: .07em;
      font-weight: 600;
    }

    .signout {
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: .45rem .75rem;
      border-radius: 7px;
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,.35);
      font-size: .775rem;
      font-weight: 500;
      font-family: var(--font);
      width: 100%;
      margin-top: .6rem;
      text-align: left;
      transition: background .14s, color .14s;
    }

    .signout:hover {
      background: rgba(220,38,38,.18);
      color: #fca5a5;
    }
  `],
  template: `
    <aside>
      <a class="brand" routerLink="/dashboard">
        <div class="brand-icon"><i class="bi bi-hospital-fill"></i></div>
        <div>
          <span class="brand-name">MedCore HMS</span>
          <span class="brand-sub">Health Management</span>
        </div>
      </a>

      <nav>
        <span class="nav-section">Overview</span>
        <a class="nav-item" routerLink="/dashboard" routerLinkActive="active">
          <span class="nav-icon"><i class="bi bi-grid-fill"></i></span>Dashboard
        </a>

        <span class="nav-section">Clinical</span>
        <a class="nav-item" routerLink="/appointments" routerLinkActive="active">
          <span class="nav-icon"><i class="bi bi-calendar-check-fill"></i></span>Appointments
        </a>

        @if (auth.role === 'PATIENT') {
          <a class="nav-item" routerLink="/patients" routerLinkActive="active">
            <span class="nav-icon"><i class="bi bi-person-lines-fill"></i></span>My Profile
          </a>
          <a class="nav-item" routerLink="/billing" routerLinkActive="active">
            <span class="nav-icon"><i class="bi bi-receipt"></i></span>Billing
          </a>
        }

        @if (auth.role === 'PROVIDER' || auth.role === 'ADMIN') {
          <a class="nav-item" routerLink="/prescriptions" routerLinkActive="active">
            <span class="nav-icon"><i class="bi bi-prescription2"></i></span>Prescriptions
          </a>
        }

        @if (auth.role !== 'PATIENT') {
          <span class="nav-section">Management</span>
          <a class="nav-item" routerLink="/patients" routerLinkActive="active">
            <span class="nav-icon"><i class="bi bi-people-fill"></i></span>Patients
          </a>
          <a class="nav-item" routerLink="/billing" routerLinkActive="active">
            <span class="nav-icon"><i class="bi bi-receipt-cutoff"></i></span>Billing
          </a>
        }

        @if (auth.role === 'ADMIN') {
          <span class="nav-section">Administration</span>
          <a class="nav-item" routerLink="/admin/users" routerLinkActive="active">
            <span class="nav-icon"><i class="bi bi-person-badge-fill"></i></span>User Management
          </a>
          <a class="nav-item" routerLink="/reports" routerLinkActive="active">
            <span class="nav-icon"><i class="bi bi-bar-chart-fill"></i></span>Reports
          </a>
        }
      </nav>

      <div class="sidebar-footer">
        <div class="user-row">
          <div class="avatar">{{ initials }}</div>
          <div class="user-info">
            <div class="user-name">{{ auth.currentUser()?.fullName }}</div>
            <div class="user-role">{{ roleLabel }}</div>
          </div>
        </div>
        <button class="signout" (click)="auth.logout()">
          <i class="bi bi-box-arrow-left"></i>Sign out
        </button>
      </div>
    </aside>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}

  get initials(): string {
    return (this.auth.currentUser()?.fullName ?? '')
      .split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
  }

  get roleLabel(): string {
    const map: Record<string, string> = {
      ADMIN: 'Administrator',
      PROVIDER: 'Healthcare Provider',
      PATIENT: 'Patient'
    };
    return map[this.auth.role ?? ''] ?? '';
  }
}
