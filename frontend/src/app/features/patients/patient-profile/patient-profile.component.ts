import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { PatientDto } from '../../../core/models';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0"><i class="bi bi-person-lines-fill me-2"></i>Patient Profile</h3>
        @if (auth.role !== 'PATIENT') {
          <button class="btn btn-danger btn-sm" (click)="deletePatient()">
            <i class="bi bi-trash me-1"></i>Delete Patient
          </button>
        }
      </div>

      @if (loading) {
        <div class="spinner-center"><div class="spinner-border text-primary"></div></div>
      } @else {
        <div class="card">
          <div class="card-header py-3">Personal Information & Medical History</div>
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="save()">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" formControlName="fullName" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Date of Birth</label>
                  <input type="date" class="form-control" formControlName="dateOfBirth" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Gender</label>
                  <select class="form-select" formControlName="gender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Phone</label>
                  <input type="text" class="form-control" formControlName="phone" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Address</label>
                  <input type="text" class="form-control" formControlName="address" />
                </div>
                <div class="col-12">
                  <label class="form-label">Medical History</label>
                  <textarea class="form-control" rows="3" formControlName="medicalHistory"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label">Allergies</label>
                  <textarea class="form-control" rows="2" formControlName="allergies"></textarea>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Insurance Provider</label>
                  <input type="text" class="form-control" formControlName="insuranceProvider" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Insurance Policy Number</label>
                  <input type="text" class="form-control" formControlName="insurancePolicyNumber" />
                </div>
              </div>

              @if (successMsg) {
                <div class="alert alert-success mt-3 py-2">{{ successMsg }}</div>
              }
              @if (errorMsg) {
                <div class="alert alert-danger mt-3 py-2">{{ errorMsg }}</div>
              }

              <div class="mt-4">
                <button type="submit" class="btn btn-primary me-2" [disabled]="saving">
                  @if (saving) { <span class="spinner-border spinner-border-sm me-2"></span> }
                  Save Changes
                </button>
                <button type="button" class="btn btn-outline-secondary" (click)="resetForm()">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class PatientProfileComponent implements OnInit {
  form!: FormGroup;
  patientId!: number;
  loading = true;
  saving = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private patientService: PatientService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['Male', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      medicalHistory: [''],
      allergies: [''],
      insuranceProvider: [''],
      insurancePolicyNumber: ['']
    });
    this.patientService.getById(this.patientId).subscribe({
      next: p => { this.patchForm(p); this.loading = false; },
      error: () => { this.errorMsg = 'Could not load patient.'; this.loading = false; }
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.successMsg = '';
    this.errorMsg = '';
    this.patientService.update(this.patientId, this.form.value as PatientDto).subscribe({
      next: p => { this.patchForm(p); this.saving = false; this.successMsg = 'Profile saved successfully.'; },
      error: () => { this.saving = false; this.errorMsg = 'Failed to save changes.'; }
    });
  }

  deletePatient() {
    if (!confirm('Delete this patient record? This cannot be undone.')) return;
    this.patientService.delete(this.patientId).subscribe({
      next: () => this.router.navigate(['/patients']),
      error: () => this.errorMsg = 'Failed to delete patient.'
    });
  }

  resetForm() {
    this.patientService.getById(this.patientId).subscribe(p => this.patchForm(p));
  }

  private patchForm(p: PatientDto) {
    this.form.patchValue(p);
  }
}
