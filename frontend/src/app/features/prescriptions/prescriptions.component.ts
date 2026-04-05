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
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0"><i class="bi bi-prescription2 me-2"></i>Prescriptions</h3>
        @if (auth.role === 'PROVIDER') {
          <button class="btn btn-primary" (click)="openNew()">
            <i class="bi bi-plus-lg me-1"></i>New Prescription
          </button>
        }
      </div>

      <!-- New / Edit Prescription Form -->
      @if (showForm && auth.role === 'PROVIDER') {
        <div class="card mb-4">
          <div class="card-header py-3">{{ editingId ? 'Edit' : 'New' }} Prescription</div>
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="submit()">
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Patient</label>
                  <select class="form-select" formControlName="patientId" [attr.disabled]="editingId ? true : null">
                    <option value="">Select patient</option>
                    @for (p of patients; track p.id) {
                      <option [value]="p.id">{{ p.fullName }}</option>
                    }
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Medication Name</label>
                  <input type="text" class="form-control" formControlName="medicationName" placeholder="e.g. Amoxicillin" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Dosage</label>
                  <input type="text" class="form-control" formControlName="dosage" placeholder="e.g. 500mg twice daily" />
                </div>
                <div class="col-12">
                  <label class="form-label">Instructions</label>
                  <textarea class="form-control" rows="2" formControlName="instructions" placeholder="e.g. Take with food"></textarea>
                </div>
              </div>
              @if (formError) {
                <div class="alert alert-danger mt-3 py-2">{{ formError }}</div>
              }
              <div class="mt-3">
                <button type="submit" class="btn btn-success me-2" [disabled]="submitting">
                  @if (submitting) { <span class="spinner-border spinner-border-sm me-2"></span> }
                  {{ editingId ? 'Update' : 'Create' }} Prescription
                </button>
                <button type="button" class="btn btn-outline-secondary" (click)="closeForm()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Prescriptions List -->
      @if (loading) {
        <div class="spinner-center"><div class="spinner-border text-primary"></div></div>
      } @else if (prescriptions.length === 0) {
        <div class="card text-center py-5">
          <i class="bi bi-prescription2 text-muted" style="font-size:3rem"></i>
          <p class="text-muted mt-2">No prescriptions found.</p>
        </div>
      } @else {
        <div class="row g-3">
          @for (rx of prescriptions; track rx.id) {
            <div class="col-md-6 col-lg-4">
              <div class="card h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0">{{ rx.medicationName }}</h6>
                    @if (rx.sentToPharmacy) {
                      <span class="badge bg-success">Sent</span>
                    } @else {
                      <span class="badge bg-warning text-dark">Pending</span>
                    }
                  </div>
                  <p class="text-muted small mb-1"><i class="bi bi-person me-1"></i>{{ rx.patientName }}</p>
                  <p class="text-muted small mb-1"><i class="bi bi-capsule me-1"></i>{{ rx.dosage }}</p>
                  <p class="small mb-1">{{ rx.instructions }}</p>
                  <p class="text-muted small mb-0">
                    <i class="bi bi-clock me-1"></i>{{ rx.createdAt | date:'mediumDate' }}
                    @if (rx.sentAt) { · Sent {{ rx.sentAt | date:'mediumDate' }} }
                  </p>
                </div>
                @if (auth.role === 'PROVIDER') {
                  <div class="card-footer d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" (click)="edit(rx)">
                      <i class="bi bi-pencil me-1"></i>Edit
                    </button>
                    @if (!rx.sentToPharmacy) {
                      <button class="btn btn-sm btn-success" (click)="send(rx)">
                        <i class="bi bi-send me-1"></i>Send to Pharmacy
                      </button>
                    }
                  </div>
                }
              </div>
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

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      medicationName: ['', Validators.required],
      dosage: ['', Validators.required],
      instructions: ['', Validators.required]
    });
    this.prescriptionService.getAll().subscribe({
      next: data => { this.prescriptions = data; this.loading = false; },
      error: () => this.loading = false
    });
    if (this.auth.role === 'PROVIDER') {
      this.patientService.getAll().subscribe(data => this.patients = data);
    }
  }

  openNew() {
    this.editingId = null;
    this.form.reset();
    this.showForm = true;
    this.formError = '';
  }

  edit(rx: PrescriptionDto) {
    this.editingId = rx.id!;
    this.form.patchValue({ patientId: rx.patientId, medicationName: rx.medicationName, dosage: rx.dosage, instructions: rx.instructions });
    this.showForm = true;
    this.formError = '';
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.formError = '';
    const val = { ...this.form.value, patientId: Number(this.form.value.patientId) };

    const obs = this.editingId
      ? this.prescriptionService.update(this.editingId, val)
      : this.prescriptionService.create(val);

    obs.subscribe({
      next: rx => {
        if (this.editingId) {
          const idx = this.prescriptions.findIndex(p => p.id === this.editingId);
          if (idx !== -1) this.prescriptions[idx] = rx;
        } else {
          this.prescriptions.unshift(rx);
        }
        this.closeForm();
        this.submitting = false;
      },
      error: () => { this.formError = 'Failed to save prescription.'; this.submitting = false; }
    });
  }

  send(rx: PrescriptionDto) {
    if (!confirm(`Send "${rx.medicationName}" to pharmacy for ${rx.patientName}?`)) return;
    this.prescriptionService.sendToPharmacy(rx.id!).subscribe(updated => {
      const idx = this.prescriptions.findIndex(p => p.id === rx.id);
      if (idx !== -1) this.prescriptions[idx] = updated;
    });
  }
}
