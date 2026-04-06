import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
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
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page-container">
      <div class="mb-4">
        <h3 style="margin-bottom:.2rem">Good {{ greeting }}, {{ firstName }}</h3>
        <p style="color:var(--muted);margin:0;font-size:.9rem">{{ today | date:'EEEE, MMMM d, y' }}</p>
      </div>

      @if (auth.role === 'PATIENT') {
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem">
          <div class="stat-card">
            <div class="stat-icon navy"><i class="bi bi-calendar-check"></i></div>
            <div><div class="stat-value">{{ upcomingCount }}</div><div class="stat-label">Upcoming Appts</div></div>
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

        <div style="display:grid;grid-template-columns:3fr 2fr;gap:1.5rem">
          <div class="card">
            <div class="card-header"><i class="bi bi-calendar-event"></i>Upcoming Appointments</div>
            @if (upcomingApts.length === 0) {
              <div class="empty-state"><i class="bi bi-calendar-x"></i><p>No upcoming appointments. <a routerLink="/appointments">Schedule one</a></p></div>
            } @else {
              @for (apt of upcomingApts.slice(0,5); track apt.id) {
                <div style="display:flex;align-items:center;justify-content:space-between;padding:.8rem 1.25rem;border-bottom:1px solid #eef1f7">
                  <div>
                    <div style="font-weight:600;font-size:.9rem">Dr. {{ apt.providerName }}</div>
                    <div style="font-size:.8rem;color:var(--muted)">{{ apt.appointmentTime | date:'EEE, MMM d · h:mm a' }}</div>
                    @if (apt.notes) { <div style="font-size:.77rem;color:var(--muted);margin-top:.1rem">{{ apt.notes }}</div> }
                  </div>
                  <span class="badge" [class]="statusBadge(apt.status)">{{ apt.status }}</span>
                </div>
              }
            }
            <div class="card-footer" style="text-align:right"><a routerLink="/appointments" class="btn btn-outline btn-sm">View all</a></div>
          </div>

          <div style="display:flex;flex-direction:column;gap:1rem">
            <div class="card">
              <div class="card-header"><i class="bi bi-bell"></i>Notifications</div>
              <div class="card-body" style="padding:.75rem 1rem;display:flex;flex-direction:column;gap:.5rem">
                @if (pendingInvoicesCount > 0) {
                  <div class="alert alert-warning" style="margin:0"><i class="bi bi-exclamation-triangle-fill"></i><span>{{ pendingInvoicesCount }} unpaid invoice(s). <a routerLink="/billing">Pay now</a></span></div>
                }
                @if (upcomingCount === 0) {
                  <div class="alert alert-info" style="margin:0"><i class="bi bi-info-circle-fill"></i><span>No upcoming appointments. <a routerLink="/appointments">Schedule</a></span></div>
                }
                @if (pendingInvoicesCount === 0 && upcomingCount > 0) {
                  <div class="alert alert-success" style="margin:0"><i class="bi bi-check-circle-fill"></i><span>All clear!</span></div>
                }
              </div>
            </div>
            <div class="card">
              <div class="card-header"><i class="bi bi-prescription2"></i>Recent Prescriptions</div>
              @if (prescriptions.length === 0) {
                <div style="padding:1.25rem;text-align:center;color:var(--muted);font-size:.85rem">None on file</div>
              } @else {
                @for (rx of prescriptions.slice(0,3); track rx.id) {
                  <div style="padding:.65rem 1.25rem;border-bottom:1px solid #eef1f7;display:flex;justify-content:space-between;align-items:center">
                    <div><div style="font-weight:600;font-size:.875rem">{{ rx.medicationName }}</div><div style="font-size:.77rem;color:var(--muted)">{{ rx.dosage }}</div></div>
                    <span class="badge" [class]="rx.sentToPharmacy ? 'badge-success' : 'badge-warning'">{{ rx.sentToPharmacy ? 'Sent' : 'Pending' }}</span>
                  </div>
                }
              }
            </div>
          </div>
        </div>
      }

      @if (auth.role === 'PROVIDER') {
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem">
          <div class="stat-card"><div class="stat-icon navy"><i class="bi bi-calendar-check"></i></div><div><div class="stat-value">{{ appointments.length }}</div><div class="stat-label">My Appointments</div></div></div>
          <div class="stat-card"><div class="stat-icon blue"><i class="bi bi-people"></i></div><div><div class="stat-value">{{ patients.length }}</div><div class="stat-label">Patients</div></div></div>
          <div class="stat-card"><div class="stat-icon green"><i class="bi bi-prescription2"></i></div><div><div class="stat-value">{{ prescriptions.length }}</div><div class="stat-label">Prescriptions</div></div></div>
        </div>
        <div class="card">
          <div class="card-header"><i class="bi bi-calendar-event"></i>Upcoming Appointments</div>
          @if (appointments.length === 0) {
            <div class="empty-state"><i class="bi bi-calendar-x"></i><p>No appointments scheduled.</p></div>
          } @else {
            <div class="table-responsive">
              <table class="table">
                <thead><tr><th>Patient</th><th>Date & Time</th><th>Notes</th><th>Status</th></tr></thead>
                <tbody>
                  @for (apt of appointments.slice(0,8); track apt.id) {
                    <tr>
                      <td style="font-weight:600">{{ apt.patientName }}</td>
                      <td style="color:var(--muted);font-size:.875rem">{{ apt.appointmentTime | date:'EEE, MMM d · h:mm a' }}</td>
                      <td style="color:var(--muted);font-size:.875rem">{{ apt.notes || '—' }}</td>
                      <td><span class="badge" [class]="statusBadge(apt.status)">{{ apt.status }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
          <div class="card-footer" style="text-align:right"><a routerLink="/appointments" class="btn btn-outline btn-sm">View all</a></div>
        </div>
      }

      @if (auth.role === 'ADMIN') {
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:2.5rem">
          <div class="stat-card"><div class="stat-icon navy"><i class="bi bi-people"></i></div><div><div class="stat-value">{{ patients.length }}</div><div class="stat-label">Total Patients</div></div></div>
          <div class="stat-card"><div class="stat-icon blue"><i class="bi bi-calendar-check"></i></div><div><div class="stat-value">{{ appointments.length }}</div><div class="stat-label">Appointments</div></div></div>
          <div class="stat-card"><div class="stat-icon orange"><i class="bi bi-receipt"></i></div><div><div class="stat-value">{{ pendingInvoicesCount }}</div><div class="stat-label">Pending Invoices</div></div></div>
          <div class="stat-card"><div class="stat-icon green"><i class="bi bi-prescription2"></i></div><div><div class="stat-value">{{ prescriptions.length }}</div><div class="stat-label">Prescriptions</div></div></div>
        </div>
        <div style="text-align:center">
          <a routerLink="/reports" class="btn btn-navy btn-lg"><i class="bi bi-bar-chart-line"></i>View Full Reports</a>
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
  get upcomingCount() { return this.upcomingApts.length; }
  get pendingInvoicesCount() { return this.invoices.filter(i => i.status === 'PENDING').length; }

  constructor(public auth: AuthService, private appointmentService: AppointmentService, private invoiceService: InvoiceService, private prescriptionService: PrescriptionService, private patientService: PatientService) {}

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
    const map: Record<string, string> = { PENDING: 'badge-warning', CONFIRMED: 'badge-success', COMPLETED: 'badge-muted', CANCELLED: 'badge-danger' };
    return 'badge ' + (map[status] ?? 'badge-muted');
  }
}
