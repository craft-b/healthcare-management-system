import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
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
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="mb-0 fw-bold">Welcome, {{ auth.currentUser()?.fullName }}</h3>
          <small class="text-muted">{{ today | date:'fullDate' }}</small>
        </div>
        <span class="badge bg-primary fs-6">{{ auth.role }}</span>
      </div>

      <!-- Patient Dashboard -->
      @if (auth.role === 'PATIENT') {
        <div class="row g-4 mb-4">
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-calendar-check text-primary" style="font-size:2.5rem"></i>
                <h4 class="mt-2 fw-bold">{{ upcomingCount }}</h4>
                <p class="text-muted mb-0">Upcoming Appointments</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-receipt text-warning" style="font-size:2.5rem"></i>
                <h4 class="mt-2 fw-bold">{{ pendingInvoicesCount }}</h4>
                <p class="text-muted mb-0">Pending Invoices</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-prescription2 text-success" style="font-size:2.5rem"></i>
                <h4 class="mt-2 fw-bold">{{ prescriptionsCount }}</h4>
                <p class="text-muted mb-0">Active Prescriptions</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-7">
            <div class="card">
              <div class="card-header py-3">
                <i class="bi bi-calendar-event me-2"></i>Upcoming Appointments
              </div>
              <div class="card-body p-0">
                @if (appointments.length === 0) {
                  <p class="text-muted text-center py-4">No upcoming appointments.</p>
                } @else {
                  <ul class="list-group list-group-flush">
                    @for (apt of appointments.slice(0, 5); track apt.id) {
                      <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div class="fw-semibold">Dr. {{ apt.providerName }}</div>
                          <small class="text-muted">{{ apt.appointmentTime | date:'medium' }}</small>
                        </div>
                        <span class="badge" [class]="statusBadge(apt.status)">{{ apt.status }}</span>
                      </li>
                    }
                  </ul>
                }
              </div>
              <div class="card-footer text-end">
                <a routerLink="/appointments" class="btn btn-sm btn-outline-primary">View All</a>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="card">
              <div class="card-header py-3">
                <i class="bi bi-bell me-2"></i>Notifications
              </div>
              <div class="card-body">
                @if (pendingInvoicesCount > 0) {
                  <div class="alert alert-warning py-2">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    You have {{ pendingInvoicesCount }} unpaid invoice(s).
                    <a routerLink="/billing" class="alert-link ms-1">View</a>
                  </div>
                }
                @if (upcomingCount === 0) {
                  <div class="alert alert-info py-2">
                    <i class="bi bi-info-circle me-2"></i>
                    No upcoming appointments.
                    <a routerLink="/appointments" class="alert-link ms-1">Schedule one</a>
                  </div>
                }
                @if (pendingInvoicesCount === 0 && upcomingCount > 0) {
                  <div class="alert alert-success py-2">
                    <i class="bi bi-check-circle me-2"></i>All clear! No pending actions.
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Provider Dashboard -->
      @if (auth.role === 'PROVIDER') {
        <div class="row g-4 mb-4">
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-calendar-check text-primary" style="font-size:2.5rem"></i>
                <h4 class="mt-2 fw-bold">{{ appointments.length }}</h4>
                <p class="text-muted mb-0">My Appointments</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-people text-info" style="font-size:2.5rem"></i>
                <h4 class="mt-2 fw-bold">{{ patients.length }}</h4>
                <p class="text-muted mb-0">Patients</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-prescription2 text-success" style="font-size:2.5rem"></i>
                <h4 class="mt-2 fw-bold">{{ prescriptionsCount }}</h4>
                <p class="text-muted mb-0">Prescriptions Issued</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header py-3"><i class="bi bi-calendar-event me-2"></i>Upcoming Appointments</div>
          <div class="card-body p-0">
            @if (appointments.length === 0) {
              <p class="text-muted text-center py-4">No appointments scheduled.</p>
            } @else {
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr><th>Patient</th><th>Date & Time</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    @for (apt of appointments.slice(0, 8); track apt.id) {
                      <tr>
                        <td class="fw-semibold">{{ apt.patientName }}</td>
                        <td>{{ apt.appointmentTime | date:'medium' }}</td>
                        <td><span class="badge" [class]="statusBadge(apt.status)">{{ apt.status }}</span></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
          <div class="card-footer text-end">
            <a routerLink="/appointments" class="btn btn-sm btn-outline-primary">View All</a>
          </div>
        </div>
      }

      <!-- Admin Dashboard -->
      @if (auth.role === 'ADMIN') {
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="card h-100 border-primary">
              <div class="card-body text-center">
                <i class="bi bi-people text-primary" style="font-size:2.5rem"></i>
                <h4 class="mt-2 fw-bold">{{ patients.length }}</h4>
                <p class="text-muted mb-0">Total Patients</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card h-100 border-success">
              <div class="card-body text-center">
                <i class="bi bi-calendar-check text-success" style="font-size:2.5rem"></i>
                <h4 class="mt-2 fw-bold">{{ appointments.length }}</h4>
                <p class="text-muted mb-0">Total Appointments</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card h-100 border-warning">
              <div class="card-body text-center">
                <i class="bi bi-receipt text-warning" style="font-size:2.5rem"></i>
                <h4 class="mt-2 fw-bold">{{ pendingInvoicesCount }}</h4>
                <p class="text-muted mb-0">Pending Invoices</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card h-100 border-info">
              <div class="card-body text-center">
                <i class="bi bi-prescription2 text-info" style="font-size:2.5rem"></i>
                <h4 class="mt-2 fw-bold">{{ prescriptionsCount }}</h4>
                <p class="text-muted mb-0">Prescriptions</p>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <a routerLink="/reports" class="btn btn-primary btn-lg">
            <i class="bi bi-bar-chart-line me-2"></i>View Full Reports
          </a>
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

  get upcomingCount() {
    return this.appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length;
  }

  get pendingInvoicesCount() {
    return this.invoices.filter(i => i.status === 'PENDING').length;
  }

  get prescriptionsCount() {
    return this.prescriptions.length;
  }

  constructor(
    public auth: AuthService,
    private appointmentService: AppointmentService,
    private invoiceService: InvoiceService,
    private prescriptionService: PrescriptionService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.appointmentService.getAll().subscribe(data => this.appointments = data);
    this.invoiceService.getAll().subscribe(data => this.invoices = data);
    this.prescriptionService.getAll().subscribe(data => this.prescriptions = data);
    if (this.auth.role !== 'PATIENT') {
      this.patientService.getAll().subscribe(data => this.patients = data);
    }
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-warning text-dark',
      CONFIRMED: 'bg-success',
      COMPLETED: 'bg-secondary',
      CANCELLED: 'bg-danger'
    };
    return `badge ${map[status] ?? 'bg-secondary'}`;
  }
}
