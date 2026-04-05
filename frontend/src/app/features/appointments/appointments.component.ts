import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../../core/services/appointment.service';
import { ProviderService } from '../../core/services/provider.service';
import { AuthService } from '../../core/services/auth.service';
import { AppointmentDto, AppointmentStatus, Provider } from '../../core/models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="page-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0"><i class="bi bi-calendar-check me-2"></i>Appointments</h3>
        @if (auth.role === 'PATIENT') {
          <button class="btn btn-primary" (click)="showForm = !showForm">
            <i class="bi bi-plus-lg me-1"></i>Schedule Appointment
          </button>
        }
      </div>

      <!-- Schedule Form (Patient only) -->
      @if (showForm && auth.role === 'PATIENT') {
        <div class="card mb-4">
          <div class="card-header py-3">Schedule New Appointment</div>
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="submitAppointment()">
              <div class="row g-3">
                <div class="col-md-5">
                  <label class="form-label">Healthcare Provider</label>
                  <select class="form-select" formControlName="providerId">
                    <option value="">Select provider</option>
                    @for (p of providers; track p.id) {
                      <option [value]="p.id">{{ p.fullName }}</option>
                    }
                  </select>
                  @if (form.get('providerId')?.touched && form.get('providerId')?.invalid) {
                    <div class="text-danger small mt-1">Please select a provider.</div>
                  }
                </div>
                <div class="col-md-4">
                  <label class="form-label">Date & Time</label>
                  <input type="datetime-local" class="form-control" formControlName="appointmentTime" />
                  @if (form.get('appointmentTime')?.touched && form.get('appointmentTime')?.invalid) {
                    <div class="text-danger small mt-1">Please select a date and time.</div>
                  }
                </div>
                <div class="col-md-3">
                  <label class="form-label">Notes <span class="text-muted">(optional)</span></label>
                  <input type="text" class="form-control" formControlName="notes" placeholder="Reason for visit" />
                </div>
              </div>
              @if (formError) {
                <div class="alert alert-danger mt-3 py-2">{{ formError }}</div>
              }
              <div class="mt-3">
                <button type="submit" class="btn btn-success me-2" [disabled]="submitting">
                  @if (submitting) { <span class="spinner-border spinner-border-sm me-2"></span> }
                  Confirm Appointment
                </button>
                <button type="button" class="btn btn-outline-secondary" (click)="showForm = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Appointments List -->
      @if (loading) {
        <div class="spinner-center"><div class="spinner-border text-primary"></div></div>
      } @else if (appointments.length === 0) {
        <div class="card text-center py-5">
          <i class="bi bi-calendar-x text-muted" style="font-size:3rem"></i>
          <p class="text-muted mt-2">No appointments found.</p>
        </div>
      } @else {
        <div class="card">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  @if (auth.role !== 'PATIENT') { <th>Patient</th> }
                  <th>Provider</th>
                  <th>Date & Time</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (apt of appointments; track apt.id) {
                  <tr>
                    @if (auth.role !== 'PATIENT') { <td>{{ apt.patientName }}</td> }
                    <td>{{ apt.providerName }}</td>
                    <td>{{ apt.appointmentTime | date:'medium' }}</td>
                    <td>{{ apt.notes || '—' }}</td>
                    <td><span class="badge" [class]="statusBadge(apt.status)">{{ apt.status }}</span></td>
                    <td>
                      @if (auth.role === 'PROVIDER' && apt.status === 'PENDING') {
                        <button class="btn btn-sm btn-success me-1" (click)="updateStatus(apt, 'CONFIRMED')">Confirm</button>
                        <button class="btn btn-sm btn-secondary me-1" (click)="updateStatus(apt, 'COMPLETED')">Complete</button>
                      }
                      @if (apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED') {
                        <button class="btn btn-sm btn-outline-danger" (click)="cancel(apt)">Cancel</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class AppointmentsComponent implements OnInit {
  appointments: AppointmentDto[] = [];
  providers: Provider[] = [];
  form!: FormGroup;
  loading = true;
  showForm = false;
  submitting = false;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private providerService: ProviderService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      providerId: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      notes: ['']
    });
    this.load();
    if (this.auth.role === 'PATIENT') {
      this.providerService.getAll().subscribe(data => this.providers = data);
    }
  }

  load() {
    this.loading = true;
    this.appointmentService.getAll().subscribe({
      next: data => { this.appointments = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  submitAppointment() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.formError = '';
    const val = this.form.value;
    this.appointmentService.create({
      providerId: Number(val.providerId),
      appointmentTime: val.appointmentTime,
      notes: val.notes
    }).subscribe({
      next: apt => {
        this.appointments.unshift(apt);
        this.form.reset();
        this.showForm = false;
        this.submitting = false;
      },
      error: () => { this.formError = 'Failed to schedule appointment.'; this.submitting = false; }
    });
  }

  updateStatus(apt: AppointmentDto, status: AppointmentStatus) {
    this.appointmentService.updateStatus(apt.id!, status).subscribe(updated => {
      const idx = this.appointments.findIndex(a => a.id === apt.id);
      if (idx !== -1) this.appointments[idx] = updated;
    });
  }

  cancel(apt: AppointmentDto) {
    if (!confirm('Cancel this appointment?')) return;
    this.appointmentService.cancel(apt.id!).subscribe(() => {
      this.appointments = this.appointments.filter(a => a.id !== apt.id);
    });
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
