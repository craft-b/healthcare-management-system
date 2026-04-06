import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface UserRow {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2>User Management</h2>
          <p class="page-subtitle">{{ users.length }} registered accounts</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem">
        <div class="stat-card">
          <div class="stat-icon navy"><i class="bi bi-shield-check"></i></div>
          <div><div class="stat-value">{{ countByRole('ADMIN') }}</div><div class="stat-label">Admins</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue"><i class="bi bi-person-badge"></i></div>
          <div><div class="stat-value">{{ countByRole('PROVIDER') }}</div><div class="stat-label">Providers</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="bi bi-people"></i></div>
          <div><div class="stat-value">{{ countByRole('PATIENT') }}</div><div class="stat-label">Patients</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange"><i class="bi bi-person-plus"></i></div>
          <div><div class="stat-value">{{ users.length }}</div><div class="stat-label">Total Users</div></div>
        </div>
      </div>

      @if (loading) {
        <div class="spinner-center"><div class="spinner"></div></div>
      } @else {
        <div class="card">
          <div class="card-header">
            <i class="bi bi-people-fill"></i>All Accounts
            <div style="margin-left:auto;display:flex;gap:.5rem">
              @for (f of ['ALL','ADMIN','PROVIDER','PATIENT']; track f) {
                <button class="btn btn-sm" [class]="filter === f ? 'btn-navy' : 'btn-ghost'" (click)="filter = f">{{ f }}</button>
              }
            </div>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr><th>#</th><th>Full Name</th><th>Username</th><th>Role</th></tr>
              </thead>
              <tbody>
                @for (u of filtered; track u.id) {
                  <tr>
                    <td style="color:var(--muted);font-size:.8rem;width:40px">{{ u.id }}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:.75rem">
                        <div class="user-avatar-sm">{{ initials(u.fullName) }}</div>
                        <span style="font-weight:600">{{ u.fullName }}</span>
                      </div>
                    </td>
                    <td style="color:var(--muted);font-size:.875rem;font-family:monospace">{{ u.username }}</td>
                    <td><span class="badge" [class]="roleBadge(u.role)">{{ u.role }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .user-avatar-sm {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--navy-light); color: var(--navy);
      display: flex; align-items: center; justify-content: center;
      font-size: .72rem; font-weight: 800; flex-shrink: 0;
    }
  `]
})
export class AdminComponent implements OnInit {
  users: UserRow[] = [];
  loading = true;
  filter = 'ALL';

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit() {
    this.http.get<UserRow[]>('/api/admin/users').subscribe({
      next: data => { this.users = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get filtered(): UserRow[] {
    return this.filter === 'ALL' ? this.users : this.users.filter(u => u.role === this.filter);
  }

  countByRole(role: string) { return this.users.filter(u => u.role === role).length; }

  initials(name: string) {
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  roleBadge(role: string): string {
    const map: Record<string, string> = { ADMIN: 'badge-navy', PROVIDER: 'badge-info', PATIENT: 'badge-success' };
    return 'badge ' + (map[role] ?? 'badge-muted');
  }
}
