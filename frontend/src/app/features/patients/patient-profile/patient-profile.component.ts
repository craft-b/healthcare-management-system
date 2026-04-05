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
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem">
        <div>
          <h3 style="margin-bottom:.2rem">Patient Profile</h3>
          <p style="color:var(--muted);margin:0;font-size:.875rem">View and edit health record</p>
        </div>
        @if (auth.role !== 'PATIENT') {
          <button class="btn btn-outline-danger btn-sm" (click)="deletePatient()">
            <i class="bi bi-trash"></i>Delete Patient
          </button>
        }
      </div>

      @if (loading) {
        <div class="spinner-center"><div class="spinner"></div></div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="card mb-3">
            <div class="card-header"><i class="bi bi-person"></i>Personal Information</div>
            <div class="card-body">
              <div class="form-row cols-3">
                <div>
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" formControlName="fullName" />
                </div>
                <div>
                  <label class="form-label">Date of Birth</label>
                  <input type="date" class="form-control" formControlName="dateOfBirth" />
                </div>
                <div>
                  <label class="form-label">Gender</label>
                  <select class="form-select" formControlName="gender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="form-label">Phone</label>
                  <input type="text" class="form-control" formControlName="phone" />
                </div>
                <div style="grid-column:span 2">
                  <label class="form-label">Address</label>
                  <input type="text" class="form-control" formControlName="address" />
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-3">
            <div class="card-header"><i class="bi bi-heart-pulse"></i>Medical History</div>
            <div class="card-body">
              <div class="form-row cols-2">
                <div>
                  <label class="form-label">Medical History</label>
                  <textarea class="form-control" rows="4" formControlName="medicalHistory" placeholder="Previous conditions, surgeries, diagnoses..."></textarea>
                </div>
                <div>
                  <label class="form-label">Allergies</label>
                  <textarea class="form-control" rows="4" formControlName="allergies" placeholder="Medication allergies, food allergies..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-3">
            <div class="card-header"><i class="bi bi-shield-check"></i>Insurance</div>
            <div class="card-body">
              <div class="form-row cols-2">
                <div>
                  <label class="form-label">Insurance Provider</label>
                  <input type="text" class="form-control" formControlName="insuranceProvider" placeholder="e.g. BlueCross BlueShield" />
                </div>
                <div>
                  <label class="form-label">Policy Number</label>
                  <input type="text" class="form-control" formControlName="insurancePolicyNumber" placeholder="e.g. BCBS-001234" />
                </div>
              </div>
            </div>
          </div>

          @if (successMsg) { <div class="alert alert-success"><i class="bi bi-check-circle-fill"></i>{{ successMsg }}</div> }
          @if (errorMsg)   { <div class="alert alert-danger"><i class="bi bi-exclamation-circle-fill"></i>{{ errorMsg }}</div> }

          <div style="display:flex;gap:.75rem">
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              @if (saving) { <span class="spinner" style="width:16px;height:16px;border-width:2px"></span> }
              <i class="bi bi-check-lg"></i>Save Changes
            </button>
            <button type="button" class="btn btn-ghost" (click)="resetForm()">Reset</button>
          </div>
        </form>
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

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private patientService: PatientService, public auth: AuthService) {}

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      fullName: ['', Validators.required], dateOfBirth: ['', Validators.required],
      gender: ['Male', Validators.required], phone: ['', Validators.required],
      address: ['', Validators.required], medicalHistory: [''], allergies: [''],
      insuranceProvider: [''], insurancePolicyNumber: ['']
    });
    this.patientService.getById(this.patientId).subscribe({
      next: p => { this.form.patchValue(p); this.loading = false; },
      error: () => { this.errorMsg = 'Could not load patient.'; this.loading = false; }
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true; this.successMsg = ''; this.errorMsg = '';
    this.patientService.update(this.patientId, this.form.value as PatientDto).subscribe({
      next: p => { this.form.patchValue(p); this.saving = false; this.successMsg = 'Profile saved successfully.'; setTimeout(() => this.successMsg = '', 3000); },
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
    this.patientService.getById(this.patientId).subscribe(p => this.form.patchValue(p));
  }
}
