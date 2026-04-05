import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [`
    nav { background:#fff; border-bottom:1px solid #dde3ee; box-shadow:0 2px 8px rgba(0,38,119,.07); position:sticky; top:0; z-index:100; }
    .nav-inner { max-width:1200px; margin:0 auto; padding:0 1.5rem; display:flex; align-items:center; gap:1.5rem; height:64px; }
    .brand { display:flex; align-items:center; gap:.6rem; text-decoration:none; flex-shrink:0; }
    .brand-icon { width:36px; height:36px; background:#002677; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.1rem; }
    .brand-name { font-weight:800; font-size:1.05rem; color:#002677; letter-spacing:-.01em; display:block; line-height:1.1; }
    .brand-sub  { font-size:.62rem; color:#5a6478; font-weight:500; text-transform:uppercase; letter-spacing:.06em; }
    .nav-links  { display:flex; align-items:center; gap:.15rem; flex:1; list-style:none; margin:0; padding:0; }
    .nav-links a { display:flex; align-items:center; gap:.4rem; padding:.4rem .85rem; border-radius:50px; color:#5a6478; font-weight:600; font-size:.855rem; text-decoration:none; transition:all .18s; white-space:nowrap; }
    .nav-links a:hover, .nav-links a.active { background:#e8eef8; color:#002677; text-decoration:none; }
    .nav-right { display:flex; align-items:center; gap:.75rem; margin-left:auto; flex-shrink:0; }
    .dropdown { position:relative; }
    .user-pill { display:flex; align-items:center; gap:.6rem; padding:.3rem .75rem .3rem .35rem; border-radius:50px; border:1.5px solid #dde3ee; background:#fff; cursor:pointer; transition:all .18s; user-select:none; }
    .user-pill:hover { border-color:#002677; background:#f4f7fb; }
    .avatar { width:30px; height:30px; background:#002677; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:.72rem; font-weight:800; flex-shrink:0; }
    .user-name { font-size:.82rem; font-weight:700; color:#1a1a2e; line-height:1.1; }
    .user-role { font-size:.65rem; color:#5a6478; text-transform:uppercase; letter-spacing:.05em; }
    .chevron   { font-size:.65rem; color:#5a6478; margin-left:.15rem; }
    .dropdown-menu { display:none; position:absolute; right:0; top:calc(100% + 8px); background:#fff; border:1px solid #dde3ee; border-radius:12px; box-shadow:0 8px 24px rgba(0,38,119,.12); min-width:170px; padding:.4rem; z-index:200; }
    .dropdown:hover .dropdown-menu { display:block; }
    .dropdown-item { display:flex; align-items:center; gap:.5rem; padding:.55rem .75rem; border-radius:8px; color:#1a1a2e; font-size:.875rem; font-weight:500; cursor:pointer; background:none; border:none; width:100%; text-align:left; transition:background .15s; font-family:inherit; }
    .dropdown-item:hover { background:#f4f7fb; }
    .dropdown-item.danger { color:#c0392b; }
    .dropdown-item.danger:hover { background:#fdecea; }
  `],
  template: `
    <nav>
      <div class="nav-inner">
        <a class="brand" routerLink="/dashboard">
          <div class="brand-icon"><i class="bi bi-hospital-fill"></i></div>
          <div>
            <span class="brand-name">HMS</span>
            <span class="brand-sub">Health Management</span>
          </div>
        </a>

        <ul class="nav-links">
          <li><a routerLink="/dashboard"     routerLinkActive="active"><i class="bi bi-speedometer2"></i>Dashboard</a></li>
          <li><a routerLink="/appointments"  routerLinkActive="active"><i class="bi bi-calendar-check"></i>Appointments</a></li>
          @if (auth.role === 'PATIENT') {
            <li><a routerLink="/patients" routerLinkActive="active"><i class="bi bi-person-lines-fill"></i>My Profile</a></li>
            <li><a routerLink="/billing"  routerLinkActive="active"><i class="bi bi-receipt"></i>Billing</a></li>
          }
          @if (auth.role === 'PROVIDER' || auth.role === 'ADMIN') {
            <li><a routerLink="/patients"       routerLinkActive="active"><i class="bi bi-people"></i>Patients</a></li>
            <li><a routerLink="/prescriptions"  routerLinkActive="active"><i class="bi bi-prescription2"></i>Prescriptions</a></li>
            <li><a routerLink="/billing"        routerLinkActive="active"><i class="bi bi-receipt"></i>Billing</a></li>
          }
          @if (auth.role === 'ADMIN') {
            <li><a routerLink="/reports" routerLinkActive="active"><i class="bi bi-bar-chart-line"></i>Reports</a></li>
          }
        </ul>

        <div class="nav-right">
          <div class="dropdown">
            <div class="user-pill">
              <div class="avatar">{{ initials }}</div>
              <div>
                <div class="user-name">{{ auth.currentUser()?.fullName }}</div>
                <div class="user-role">{{ auth.role }}</div>
              </div>
              <i class="bi bi-chevron-down chevron"></i>
            </div>
            <div class="dropdown-menu">
              <button class="dropdown-item danger" (click)="auth.logout()">
                <i class="bi bi-box-arrow-right"></i> Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}

  get initials(): string {
    return (this.auth.currentUser()?.fullName ?? '')
      .split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
  }
}
