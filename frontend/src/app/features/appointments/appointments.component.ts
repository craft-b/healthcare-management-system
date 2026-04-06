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
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem">
        <div>
          <h3 style="margin-bottom:.2rem">Appointments</h3>
          <p style="color:var(--muted);margin:0;font-size:.875rem">{{ appointments.length }} total appointment(s)</p>
        </div>
        @if (auth.role === 'PATIENT') {
          <button class="btn btn-primary" (click)="showForm = !showForm">
            <i class="bi bi-plus-lg"></i>Schedule Appointment
          </button>
        }
      </div>

      @if (showForm && auth.role === 'PATIENT') {
        <div class="card mb-4">
          <div class="card-header"><i class="bi bi-calendar-plus"></i>Schedule New Appointment</div>
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="submitAppointment()">
              <div class="form-row cols-3">
                <div>
                  <label class="form-label">Healthcare Provider</label>
                  <select class="form-select" formControlName="providerId">
                    <option value="">Select a provider</option>
                    @for (p of providers; track p.id) { <option [value]="p.id">{{ p.fullName }}</option> }
                  </select>
                  @if (form.get('providerId')?.touched && form.get('providerId')?.invalid) { <span class="field-error">Please select a provider.</span> }
                </div>
                <div>
                  <label class="form-label">Date & Time</label>
                  <input type="datetime-local" class="form-control" formControlName="appointmentTime" />
                  @if (form.get('appointmentTime')?.touched && form.get('appointmentTime')?.invalid) { <span class="field-error">Please select a date and time.</span> }
                </div>
                <div>
                  <label class="form-label">Reason for visit <span style="font-weight:400;color:var(--muted)">(optional)</span></label>
                  <input type="text" class="form-control" formControlName="notes" placeholder="e.g. Annual checkup" />
                </div>
              </div>
              @if (formError) { <div class="alert alert-danger mt-2"><i class="bi bi-exclamation-circle-fill"></i>{{ formError }}</div> }
              <div style="margin-top:1rem;display:flex;gap:.75rem">
                <button type="submit" class="btn btn-primary" [disabled]="submitting">
                  @if (submitting) { <span class="spinner" style="width:16px;height:16px;border-width:2px"></span> }
                  <i class="bi bi-check-lg"></i>Confirm Appointment
                </button>
                <button type="button" class="btn btn-ghost" (click)="showForm = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (loading) {
        <div class="spinner-center"><div class="spinner"></div></div>
      } @else if (appointments.length === 0) {
        <div class="card"><div class="empty-state"><i class="bi bi-calendar-x"></i><p>No appointments found.</p></div></div>
      } @else {
        <div class="card">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  @if (auth.role !== 'PATIENT') { <th>Patient</th> }
                  <th>Provider</th><th>Date & Time</th><th>Notes</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (apt of appointments; track apt.id) {
                  <tr>
                    @if (auth.role !== 'PATIENT') { <td style="font-weight:600">{{ apt.patientName }}</td> }
                    <td style="font-weight:500">{{ apt.providerName }}</td>
                    <td style="font-size:.875rem;color:var(--muted)">{{ apt.appointmentTime | date:'EEE, MMM d · h:mm a' }}</td>
                    <td style="font-size:.875rem;color:var(--muted)">{{ apt.notes || '—' }}</td>
                    <td><span class="badge" [class]="statusBadge(apt.status)">{{ apt.status }}</span></td>
                    <td>
                      <div style="display:flex;gap:.4rem;flex-wrap:wrap">
                        @if (auth.role === 'PROVIDER' && apt.status === 'PENDING') {
                          <button class="btn btn-success btn-sm" (click)="updateStatus(apt, 'CONFIRMED')"><i class="bi bi-check"></i>Confirm</button>
                          <button class="btn btn-outline btn-sm" (click)="updateStatus(apt, 'COMPLETED')">Complete</button>
                        }
                        @if (apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED') {
                          <button class="btn btn-outline-danger btn-sm" (click)="cancel(apt)"><i class="bi bi-x"></i>Cancel</button>
                        }
                      </div>
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

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService, private providerService: ProviderService, public auth: AuthService) {}

  ngOnInit() {
    this.form = this.fb.group({ providerId: ['', Validators.required], appointmentTime: ['', Validators.required], notes: [''] });
    this.appointmentService.getAll().subscribe({ next: data => { this.appointments = data; this.loading = false; }, error: () => this.loading = false });
    if (this.auth.role === 'PATIENT') { this.providerService.getAll().subscribe(data => this.providers = data); }
  }

  submitAppointment() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true; this.formError = '';
    const val = this.form.value;
    const appointmentTime = val.appointmentTime.length === 16 ? val.appointmentTime + ':00' : val.appointmentTime;
    this.appointmentService.create({ providerId: Number(val.providerId), appointmentTime, notes: val.notes }).subscribe({
      next: apt => { this.appointments.unshift(apt); this.form.reset(); this.showForm = false; this.submitting = false; },
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
    this.appointmentService.cancel(apt.id!).subscribe(() => { this.appointments = this.appointments.filter(a => a.id !== apt.id); });
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = { PENDING: 'badge-warning', CONFIRMED: 'badge-success', COMPLETED: 'badge-muted', CANCELLED: 'badge-danger' };
    return 'badge ' + (map[status] ?? 'badge-muted');
  }
}
