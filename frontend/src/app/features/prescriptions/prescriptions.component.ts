import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PrescriptionService } from '../../core/services/prescription.service';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { PrescriptionDto, PatientDto } from '../../core/models';

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="page-container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem">
        <div>
          <h3 style="margin-bottom:.2rem">Prescriptions</h3>
          <p style="color:var(--muted);margin:0;font-size:.875rem">{{ prescriptions.length }} prescription(s)</p>
        </div>
        @if (auth.role === 'PROVIDER') {
          <button class="btn btn-primary" (click)="openNew()"><i class="bi bi-plus-lg"></i>New Prescription</button>
        }
      </div>

      @if (showForm && auth.role === 'PROVIDER') {
        <div class="card mb-4">
          <div class="card-header"><i class="bi bi-prescription2"></i>{{ editingId ? 'Edit' : 'New' }} Prescription</div>
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="submit()">
              <div class="form-row cols-3">
                <div>
                  <label class="form-label">Patient</label>
                  <select class="form-select" formControlName="patientId" [attr.disabled]="editingId ? true : null">
                    <option value="">Select patient</option>
                    @for (p of patients; track p.id) { <option [value]="p.id">{{ p.fullName }}</option> }
                  </select>
                </div>
                <div>
                  <label class="form-label">Medication Name</label>
                  <input type="text" class="form-control" formControlName="medicationName" placeholder="e.g. Amoxicillin 500mg" />
                </div>
                <div>
                  <label class="form-label">Dosage</label>
                  <input type="text" class="form-control" formControlName="dosage" placeholder="e.g. 500mg twice daily" />
                </div>
              </div>
              <div style="margin-top:1rem">
                <label class="form-label">Instructions</label>
                <textarea class="form-control" rows="2" formControlName="instructions" placeholder="e.g. Take with food. Avoid alcohol."></textarea>
              </div>
              @if (formError) { <div class="alert alert-danger mt-2"><i class="bi bi-exclamation-circle-fill"></i>{{ formError }}</div> }
              <div style="margin-top:1rem;display:flex;gap:.75rem">
                <button type="submit" class="btn btn-primary" [disabled]="submitting">
                  @if (submitting) { <span class="spinner" style="width:16px;height:16px;border-width:2px"></span> }
                  {{ editingId ? 'Update' : 'Create' }}
                </button>
                <button type="button" class="btn btn-ghost" (click)="closeForm()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (loading) {
        <div class="spinner-center"><div class="spinner"></div></div>
      } @else if (prescriptions.length === 0) {
        <div class="card"><div class="empty-state"><i class="bi bi-prescription2"></i><p>No prescriptions found.</p></div></div>
      } @else {
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem">
          @for (rx of prescriptions; track rx.id) {
            <div class="rx-card">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem">
                <div>
                  <div style="font-weight:700;font-size:.975rem;color:var(--navy)">{{ rx.medicationName }}</div>
                  <div style="font-size:.8rem;color:var(--muted);margin-top:.1rem"><i class="bi bi-capsule me-1"></i>{{ rx.dosage }}</div>
                </div>
                <span class="badge" [class]="rx.sentToPharmacy ? 'badge-success' : 'badge-warning'">
                  {{ rx.sentToPharmacy ? 'Sent' : 'Pending' }}
                </span>
              </div>
              <div style="font-size:.85rem;color:var(--muted);margin-bottom:.5rem"><i class="bi bi-person me-1"></i>{{ rx.patientName }}</div>
              <div style="font-size:.85rem;margin-bottom:.5rem">{{ rx.instructions }}</div>
              <div style="font-size:.77rem;color:var(--muted)">
                <i class="bi bi-clock me-1"></i>{{ rx.createdAt | date:'MMM d, y' }}
                @if (rx.sentAt) { &nbsp;· Sent {{ rx.sentAt | date:'MMM d' }} }
              </div>
              @if (auth.role === 'PROVIDER') {
                <div class="rx-card-footer">
                  <button class="btn btn-outline btn-sm" (click)="edit(rx)"><i class="bi bi-pencil"></i>Edit</button>
                  @if (!rx.sentToPharmacy) {
                    <button class="btn btn-success btn-sm" (click)="send(rx)"><i class="bi bi-send"></i>Send</button>
                    <button class="btn btn-outline-danger btn-sm" (click)="remove(rx)"><i class="bi bi-trash"></i></button>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class PrescriptionsComponent implements OnInit {
  prescriptions: PrescriptionDto[] = [];
  patients: PatientDto[] = [];
  form!: FormGroup;
  loading = true;
  showForm = false;
  submitting = false;
  formError = '';
  editingId: number | null = null;

  constructor(private fb: FormBuilder, private prescriptionService: PrescriptionService, private patientService: PatientService, public auth: AuthService) {}

  ngOnInit() {
    this.form = this.fb.group({ patientId: ['', Validators.required], medicationName: ['', Validators.required], dosage: ['', Validators.required], instructions: ['', Validators.required] });
    this.prescriptionService.getAll().subscribe({ next: data => { this.prescriptions = data; this.loading = false; }, error: () => this.loading = false });
    if (this.auth.role === 'PROVIDER') { this.patientService.getAll().subscribe(data => this.patients = data); }
  }

  openNew() { this.editingId = null; this.form.reset(); this.showForm = true; this.formError = ''; }
  edit(rx: PrescriptionDto) { this.editingId = rx.id!; this.form.patchValue(rx); this.showForm = true; this.formError = ''; }
  closeForm() { this.showForm = false; this.editingId = null; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true; this.formError = '';
    const val = { ...this.form.value, patientId: Number(this.form.value.patientId) };
    const obs = this.editingId ? this.prescriptionService.update(this.editingId, val) : this.prescriptionService.create(val);
    obs.subscribe({
      next: rx => {
        if (this.editingId) { const i = this.prescriptions.findIndex(p => p.id === this.editingId); if (i !== -1) this.prescriptions[i] = rx; }
        else { this.prescriptions.unshift(rx); }
        this.closeForm(); this.submitting = false;
      },
      error: () => { this.formError = 'Failed to save prescription.'; this.submitting = false; }
    });
  }

  send(rx: PrescriptionDto) {
    if (!confirm(`Send "${rx.medicationName}" to pharmacy for ${rx.patientName}?`)) return;
    this.prescriptionService.sendToPharmacy(rx.id!).subscribe(updated => { const i = this.prescriptions.findIndex(p => p.id === rx.id); if (i !== -1) this.prescriptions[i] = updated; });
  }

  remove(rx: PrescriptionDto) {
    if (!confirm(`Delete prescription for "${rx.medicationName}"? This cannot be undone.`)) return;
    this.prescriptionService.delete(rx.id!).subscribe(() => { this.prescriptions = this.prescriptions.filter(p => p.id !== rx.id); });
  }
}
