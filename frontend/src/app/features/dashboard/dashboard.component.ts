import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { PrescriptionService } from '../../core/services/prescription.service';
import { PatientService } from '../../core/services/patient.service';
import { AppointmentDto, InvoiceDto, PrescriptionDto, PatientDto } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe],
  template: `
    <div class="page-container">

      <!-- ── Welcome Banner ── -->
      <div class="welcome-banner">
        <div style="position:relative;z-index:1">
          <h2>Good {{ greeting }}, {{ firstName }}</h2>
          <p class="date">{{ today | date:'EEEE, MMMM d, y' }}</p>
          @if (auth.role === 'PATIENT' && pendingInvoicesCount > 0) {
            <div style="margin-top:1.25rem;display:inline-flex;align-items:center;gap:.6rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:.5rem 1rem;font-size:.875rem;color:rgba(255,255,255,.9)">
              <i class="bi bi-exclamation-circle-fill" style="color:#fcd34d"></i>
              You have {{ pendingInvoicesCount }} unpaid invoice(s).
              <a routerLink="/billing" style="color:#93c5fd;font-weight:600;text-decoration:underline">Pay now</a>
            </div>
          }
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════
           PATIENT VIEW
      ═══════════════════════════════════════════════════════ -->
      @if (auth.role === 'PATIENT') {

        <!-- Quick Actions (One Medical style) -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:2rem">
          <a routerLink="/appointments" class="action-card">
            <div class="action-card-icon"><i class="bi bi-calendar-plus"></i></div>
            <h4>Book Appointment</h4>
            <p>Schedule a visit with your care team</p>
          </a>
          <a routerLink="/billing" class="action-card">
            <div class="action-card-icon" style="background:var(--cta-light);color:var(--cta)"><i class="bi bi-receipt"></i></div>
            <h4>Billing</h4>
            <p>View and pay your invoices</p>
          </a>
          <a routerLink="/patients" class="action-card">
            <div class="action-card-icon" style="background:var(--teal-light);color:var(--teal)"><i class="bi bi-person-lines-fill"></i></div>
            <h4>My Health Record</h4>
            <p>Allergies, medications, history</p>
          </a>
        </div>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem">
          <div class="stat-card">
            <div class="stat-icon navy"><i class="bi bi-calendar-check"></i></div>
            <div><div class="stat-value">{{ upcomingCount }}</div><div class="stat-label">Upcoming Appts</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange"><i class="bi bi-receipt"></i></div>
            <div><div class="stat-value">{{ pendingInvoicesCount }}</div><div class="stat-label">Unpaid Invoices</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><i class="bi bi-prescription2"></i></div>
            <div><div class="stat-value">{{ prescriptions.length }}</div><div class="stat-label">Prescriptions</div></div>
          </div>
        </div>

        <!-- Two-column content -->
        <div style="display:grid;grid-template-columns:3fr 2fr;gap:1.5rem">

          <!-- Upcoming appointments -->
          <div class="card">
            <div class="card-header"><i class="bi bi-calendar-event-fill"></i>Upcoming Appointments</div>
            @if (upcomingApts.length === 0) {
              <div class="empty-state">
                <i class="bi bi-calendar-x"></i>
                <p>No upcoming appointments.<br><a routerLink="/appointments">Schedule one now</a></p>
              </div>
            } @else {
              @for (apt of upcomingApts.slice(0,5); track apt.id) {
                <div class="feed-item">
                  <div class="feed-dot" [style.background]="apt.status === 'CONFIRMED' ? 'var(--success)' : 'var(--warning)'"></div>
                  <div style="flex:1;min-width:0">
                    <div style="font-weight:600;font-size:.9rem">{{ apt.providerName }}</div>
                    <div style="font-size:.8rem;color:var(--muted);margin-top:.1rem">{{ apt.appointmentTime | date:'EEE, MMM d · h:mm a' }}</div>
                    @if (apt.notes) {
                      <div style="font-size:.78rem;color:var(--muted);margin-top:.15rem;font-style:italic">"{{ apt.notes }}"</div>
                    }
                  </div>
                  <span class="badge" [class]="statusBadge(apt.status)">{{ apt.status }}</span>
                </div>
              }
            }
            <div class="card-footer" style="text-align:right">
              <a routerLink="/appointments" class="btn btn-outline btn-sm">View all</a>
            </div>
          </div>

          <!-- Right column -->
          <div style="display:flex;flex-direction:column;gap:1.25rem">

            <!-- Prescriptions -->
            <div class="card">
              <div class="card-header"><i class="bi bi-prescription2"></i>Active Prescriptions</div>
              @if (prescriptions.length === 0) {
                <div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:.875rem">None on file</div>
              } @else {
                @for (rx of prescriptions.slice(0,4); track rx.id) {
                  <div style="padding:.8rem 1.25rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <div style="font-weight:600;font-size:.875rem">{{ rx.medicationName }}</div>
                      <div style="font-size:.75rem;color:var(--muted)">{{ rx.dosage }}</div>
                    </div>
                    <span class="badge" [class]="rx.sentToPharmacy ? 'badge-success' : 'badge-warning'">
                      {{ rx.sentToPharmacy ? 'Active' : 'Pending' }}
                    </span>
                  </div>
                }
              }
            </div>

            <!-- Recent invoices -->
            @if (recentInvoices.length > 0) {
              <div class="card">
                <div class="card-header"><i class="bi bi-receipt-cutoff"></i>Recent Invoices</div>
                @for (inv of recentInvoices.slice(0,3); track inv.id) {
                  <div style="padding:.8rem 1.25rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
                    <div>
                      <div style="font-size:.8375rem;font-weight:500">{{ inv.serviceDescription }}</div>
                      <div style="font-size:.75rem;color:var(--muted)">{{ inv.issuedAt | date:'MMM d' }}</div>
                    </div>
                    <div style="text-align:right">
                      <div style="font-weight:700;font-size:.875rem">{{ inv.amount | currency }}</div>
                      <span class="badge" [class]="invBadge(inv.status)" style="font-size:.6rem">{{ inv.status }}</span>
                    </div>
                  </div>
                }
              </div>
            }

          </div>
        </div>
      }

      <!-- ══════════════════════════════════════════════════════
           PROVIDER VIEW — Athenahealth: next action front/center
      ═══════════════════════════════════════════════════════ -->
      @if (auth.role === 'PROVIDER') {

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem">
          <div class="stat-card">
            <div class="stat-icon navy"><i class="bi bi-calendar-check"></i></div>
            <div><div class="stat-value">{{ todayApts.length }}</div><div class="stat-label">Today's Appts</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon teal"><i class="bi bi-calendar-week"></i></div>
            <div><div class="stat-value">{{ upcomingApts.length }}</div><div class="stat-label">Upcoming</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue"><i class="bi bi-people-fill"></i></div>
            <div><div class="stat-value">{{ patients.length }}</div><div class="stat-label">Patients</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><i class="bi bi-prescription2"></i></div>
            <div><div class="stat-value">{{ prescriptions.length }}</div><div class="stat-label">Prescriptions</div></div>
          </div>
        </div>

        <!-- Schedule + pending actions -->
        <div style="display:grid;grid-template-columns:3fr 2fr;gap:1.5rem">

          <div class="card">
            <div class="card-header">
              <i class="bi bi-calendar3"></i>Appointment Schedule
            </div>
            @if (appointments.length === 0) {
              <div class="empty-state"><i class="bi bi-calendar-x"></i><p>No appointments on record.</p></div>
            } @else {
              <div class="table-responsive">
                <table class="table">
                  <thead><tr><th>Patient</th><th>Date &amp; Time</th><th>Reason</th><th>Status</th></tr></thead>
                  <tbody>
                    @for (apt of appointments.slice(0,8); track apt.id) {
                      <tr>
                        <td style="font-weight:600">{{ apt.patientName }}</td>
                        <td style="font-size:.8125rem;color:var(--muted)">{{ apt.appointmentTime | date:'EEE MMM d · h:mm a' }}</td>
                        <td style="font-size:.8125rem;color:var(--muted);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ apt.notes || '—' }}</td>
                        <td><span class="badge" [class]="statusBadge(apt.status)">{{ apt.status }}</span></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
            <div class="card-footer" style="text-align:right">
              <a routerLink="/appointments" class="btn btn-outline btn-sm">View all</a>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:1.25rem">
            <!-- Pending confirmations -->
            <div class="card">
              <div class="card-header"><i class="bi bi-clock-history"></i>Needs Action</div>
              @if (pendingApts.length === 0) {
                <div style="padding:1.25rem;text-align:center;color:var(--muted);font-size:.875rem">
                  <i class="bi bi-check-circle-fill" style="color:var(--success)"></i> All clear
                </div>
              } @else {
                @for (apt of pendingApts.slice(0,4); track apt.id) {
                  <div class="feed-item">
                    <div class="feed-dot" style="background:var(--warning)"></div>
                    <div>
                      <div style="font-weight:600;font-size:.85rem">{{ apt.patientName }}</div>
                      <div style="font-size:.77rem;color:var(--muted)">{{ apt.appointmentTime | date:'MMM d · h:mm a' }}</div>
                    </div>
                  </div>
                }
              }
              <div class="card-footer" style="text-align:right">
                <a routerLink="/appointments" class="btn btn-outline btn-sm">Review</a>
              </div>
            </div>

            <!-- Quick actions -->
            <div class="card">
              <div class="card-header"><i class="bi bi-lightning-fill"></i>Quick Actions</div>
              <div style="padding:1rem;display:flex;flex-direction:column;gap:.6rem">
                <a routerLink="/prescriptions" class="btn btn-outline btn-block"><i class="bi bi-prescription2"></i>New Prescription</a>
                <a routerLink="/billing" class="btn btn-outline btn-block"><i class="bi bi-file-earmark-plus"></i>Create Invoice</a>
                <a routerLink="/patients" class="btn btn-outline btn-block"><i class="bi bi-people"></i>View Patients</a>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ══════════════════════════════════════════════════════
           ADMIN VIEW — KPI overview + system health
      ═══════════════════════════════════════════════════════ -->
      @if (auth.role === 'ADMIN') {

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem">
          <div class="stat-card">
            <div class="stat-icon navy"><i class="bi bi-people-fill"></i></div>
            <div><div class="stat-value">{{ patients.length }}</div><div class="stat-label">Total Patients</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue"><i class="bi bi-calendar-check-fill"></i></div>
            <div><div class="stat-value">{{ appointments.length }}</div><div class="stat-label">Appointments</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange"><i class="bi bi-receipt"></i></div>
            <div><div class="stat-value">{{ pendingInvoicesCount }}</div><div class="stat-label">Pending Invoices</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><i class="bi bi-prescription2"></i></div>
            <div><div class="stat-value">{{ prescriptions.length }}</div><div class="stat-label">Prescriptions</div></div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:2fr 1fr;gap:1.5rem">

          <!-- Recent appointments -->
          <div class="card">
            <div class="card-header"><i class="bi bi-activity"></i>Recent Activity</div>
            @if (appointments.length === 0) {
              <div class="empty-state"><i class="bi bi-calendar-x"></i><p>No appointments yet.</p></div>
            } @else {
              <div class="table-responsive">
                <table class="table">
                  <thead><tr><th>Patient</th><th>Provider</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    @for (apt of appointments.slice(0,8); track apt.id) {
                      <tr>
                        <td style="font-weight:600;font-size:.8125rem">{{ apt.patientName }}</td>
                        <td style="font-size:.8125rem;color:var(--muted)">{{ apt.providerName }}</td>
                        <td style="font-size:.8125rem;color:var(--muted)">{{ apt.appointmentTime | date:'MMM d, y' }}</td>
                        <td><span class="badge" [class]="statusBadge(apt.status)">{{ apt.status }}</span></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>

          <!-- Admin quick links -->
          <div style="display:flex;flex-direction:column;gap:1.25rem">
            <div class="card">
              <div class="card-header"><i class="bi bi-speedometer2"></i>System</div>
              <div style="padding:1rem;display:flex;flex-direction:column;gap:.6rem">
                <a routerLink="/admin/users" class="btn btn-outline btn-block"><i class="bi bi-person-badge-fill"></i>User Management</a>
                <a routerLink="/reports" class="btn btn-navy btn-block"><i class="bi bi-bar-chart-fill"></i>Reports</a>
                <a routerLink="/billing" class="btn btn-outline btn-block"><i class="bi bi-receipt-cutoff"></i>Billing Overview</a>
              </div>
            </div>

            <!-- Billing summary -->
            <div class="card">
              <div class="card-header"><i class="bi bi-currency-dollar"></i>Billing Snapshot</div>
              <div style="padding:1rem;display:flex;flex-direction:column;gap:.75rem">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:.8125rem;color:var(--muted)">Pending</span>
                  <span style="font-weight:700;color:var(--warning)">{{ pendingInvoicesCount }}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:.8125rem;color:var(--muted)">Total invoices</span>
                  <span style="font-weight:700">{{ invoices.length }}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:.8125rem;color:var(--muted)">Paid</span>
                  <span style="font-weight:700;color:var(--success)">{{ paidCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class DashboardComponent implements OnInit {
  today = new Date();
  appointments: AppointmentDto[] = [];
  invoices: InvoiceDto[] = [];
  prescriptions: PrescriptionDto[] = [];
  patients: PatientDto[] = [];

  get greeting() { const h = new Date().getHours(); return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'; }
  get firstName() { return this.auth.currentUser()?.fullName?.split(' ')[0] ?? ''; }
  get upcomingApts() { return this.appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED'); }
  get todayApts() {
    const today = new Date().toDateString();
    return this.appointments.filter(a => new Date(a.appointmentTime).toDateString() === today);
  }
  get pendingApts() { return this.appointments.filter(a => a.status === 'PENDING'); }
  get upcomingCount() { return this.upcomingApts.length; }
  get pendingInvoicesCount() { return this.invoices.filter(i => i.status === 'PENDING').length; }
  get paidCount() { return this.invoices.filter(i => i.status === 'PAID').length; }
  get recentInvoices() { return this.invoices.slice(0, 3); }

  constructor(
    public auth: AuthService,
    private appointmentService: AppointmentService,
    private invoiceService: InvoiceService,
    private prescriptionService: PrescriptionService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    const base$ = {
      appointments: this.appointmentService.getAll(),
      invoices: this.invoiceService.getAll(),
      prescriptions: this.prescriptionService.getAll()
    };
    const queries$ = this.auth.role !== 'PATIENT'
      ? { ...base$, patients: this.patientService.getAll() }
      : base$;

    forkJoin(queries$).subscribe((data: any) => {
      this.appointments = data.appointments;
      this.invoices = data.invoices;
      this.prescriptions = data.prescriptions;
      if (data.patients) this.patients = data.patients;
    });
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'badge-warning', CONFIRMED: 'badge-success',
      COMPLETED: 'badge-muted', CANCELLED: 'badge-danger'
    };
    return 'badge ' + (map[status] ?? 'badge-muted');
  }

  invBadge(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'badge-warning', PAID: 'badge-success',
      CLAIM_SUBMITTED: 'badge-info', CLAIM_APPROVED: 'badge-teal', CLAIM_DENIED: 'badge-danger'
    };
    return 'badge ' + (map[status] ?? 'badge-muted');
  }
}
