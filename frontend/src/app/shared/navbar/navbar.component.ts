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
      width: 256px;
      background: var(--sidebar-bg);
      display: flex;
      flex-direction: column;
      z-index: 200;
      overflow-y: auto;
      overflow-x: hidden;
    }

    /* ── Brand ── */
    .brand {
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: 1.25rem 1.25rem 1rem;
      text-decoration: none;
      border-bottom: 1px solid var(--sidebar-bdr);
      flex-shrink: 0;
    }

    .brand-icon {
      width: 38px; height: 38px;
      background: rgba(255,255,255,.12);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 1.15rem;
      flex-shrink: 0;
    }

    .brand-name {
      font-size: .95rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -.01em;
      display: block;
      line-height: 1.2;
    }

    .brand-sub {
      font-size: .65rem;
      color: rgba(255,255,255,.5);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: .07em;
    }

    /* ── Nav ── */
    nav {
      flex: 1;
      padding: .75rem .75rem 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-section {
      font-size: .65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: rgba(255,255,255,.3);
      padding: 1rem .5rem .35rem;
    }

    .nav-section:first-child { padding-top: .5rem; }

    a.nav-item {
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: .58rem .75rem;
      border-radius: 7px;
      color: var(--sidebar-text);
      font-size: .8375rem;
      font-weight: 500;
      text-decoration: none !important;
      transition: background .15s, color .15s;
      white-space: nowrap;
    }

    a.nav-item i {
      font-size: 1.05rem;
      width: 20px;
      text-align: center;
      flex-shrink: 0;
      opacity: .8;
    }

    a.nav-item:hover {
      background: var(--sidebar-hover);
      color: #fff;
    }

    a.nav-item:hover i { opacity: 1; }

    a.nav-item.active {
      background: var(--sidebar-active);
      color: #fff;
      font-weight: 600;
    }

    a.nav-item.active i { opacity: 1; }

    /* ── Divider ── */
    .nav-divider {
      height: 1px;
      background: var(--sidebar-bdr);
      margin: .75rem 0;
    }

    /* ── Footer ── */
    .sidebar-footer {
      padding: .875rem 1rem;
      border-top: 1px solid var(--sidebar-bdr);
      flex-shrink: 0;
    }

    .user-row {
      display: flex;
      align-items: center;
      gap: .75rem;
    }

    .avatar {
      width: 34px; height: 34px;
      background: rgba(255,255,255,.15);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff;
      font-size: .7rem;
      font-weight: 800;
      flex-shrink: 0;
      letter-spacing: -.02em;
    }

    .user-name {
      font-size: .8rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: .65rem;
      color: rgba(255,255,255,.45);
      text-transform: uppercase;
      letter-spacing: .06em;
      font-weight: 600;
    }

    .signout {
      margin-top: .6rem;
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: .45rem .75rem;
      border-radius: 6px;
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,.45);
      font-size: .775rem;
      font-weight: 500;
      font-family: var(--font);
      width: 100%;
      text-align: left;
      transition: background .15s, color .15s;
    }

    .signout:hover {
      background: rgba(220,38,38,.2);
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
          <i class="bi bi-grid-1x2-fill"></i><span>Dashboard</span>
        </a>

        <span class="nav-section">Clinical</span>
        <a class="nav-item" routerLink="/appointments" routerLinkActive="active">
          <i class="bi bi-calendar-check-fill"></i><span>Appointments</span>
        </a>

        @if (auth.role === 'PATIENT') {
          <a class="nav-item" routerLink="/patients" routerLinkActive="active">
            <i class="bi bi-person-lines-fill"></i><span>My Profile</span>
          </a>
          <a class="nav-item" routerLink="/billing" routerLinkActive="active">
            <i class="bi bi-receipt"></i><span>Billing</span>
          </a>
        }

        @if (auth.role === 'PROVIDER' || auth.role === 'ADMIN') {
          <a class="nav-item" routerLink="/prescriptions" routerLinkActive="active">
            <i class="bi bi-prescription2"></i><span>Prescriptions</span>
          </a>
        }

        @if (auth.role !== 'PATIENT') {
          <span class="nav-section">Management</span>
          <a class="nav-item" routerLink="/patients" routerLinkActive="active">
            <i class="bi bi-people-fill"></i><span>Patients</span>
          </a>
          <a class="nav-item" routerLink="/billing" routerLinkActive="active">
            <i class="bi bi-receipt-cutoff"></i><span>Billing</span>
          </a>
        }

        @if (auth.role === 'ADMIN') {
          <span class="nav-section">Administration</span>
          <a class="nav-item" routerLink="/admin/users" routerLinkActive="active">
            <i class="bi bi-person-badge-fill"></i><span>User Management</span>
          </a>
          <a class="nav-item" routerLink="/reports" routerLinkActive="active">
            <i class="bi bi-bar-chart-fill"></i><span>Reports</span>
          </a>
        }
      </nav>

      <div class="sidebar-footer">
        <div class="user-row">
          <div class="avatar">{{ initials }}</div>
          <div style="min-width:0;flex:1">
            <div class="user-name">{{ auth.currentUser()?.fullName }}</div>
            <div class="user-role">{{ roleLabel }}</div>
          </div>
        </div>
        <button class="signout" (click)="auth.logout()">
          <i class="bi bi-box-arrow-left"></i> Sign out
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
    const map: Record<string, string> = { ADMIN: 'Administrator', PROVIDER: 'Healthcare Provider', PATIENT: 'Patient' };
    return map[this.auth.role ?? ''] ?? this.auth.role ?? '';
  }
}
