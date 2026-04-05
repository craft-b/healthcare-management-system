import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { PatientDto } from '../../core/models';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem">
        <div>
          <h3 style="margin-bottom:.2rem">{{ auth.role === 'PATIENT' ? 'My Profile' : 'Patients' }}</h3>
          <p style="color:var(--muted);margin:0;font-size:.875rem">{{ auth.role === 'PATIENT' ? 'View your health record' : patients.length + ' registered patients' }}</p>
        </div>
      </div>

      @if (loading) {
        <div class="spinner-center"><div class="spinner"></div></div>
      } @else if (patients.length === 0) {
        <div class="card"><div class="empty-state"><i class="bi bi-person-x"></i><p>No patient records found.</p></div></div>
      } @else {
        <div class="card">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr><th>Name</th><th>Date of Birth</th><th>Gender</th><th>Phone</th><th>Insurance</th><th></th></tr>
              </thead>
              <tbody>
                @for (p of patients; track p.id) {
                  <tr>
                    <td>
                      <div style="font-weight:600">{{ p.fullName }}</div>
                      @if (p.allergies) { <div style="font-size:.75rem;color:var(--danger)"><i class="bi bi-exclamation-triangle-fill"></i> {{ p.allergies }}</div> }
                    </td>
                    <td style="color:var(--muted);font-size:.875rem">{{ p.dateOfBirth }}</td>
                    <td style="color:var(--muted);font-size:.875rem">{{ p.gender }}</td>
                    <td style="font-size:.875rem">{{ p.phone }}</td>
                    <td>
                      @if (p.insuranceProvider) {
                        <div style="font-size:.875rem;font-weight:500">{{ p.insuranceProvider }}</div>
                        <div style="font-size:.75rem;color:var(--muted)">{{ p.insurancePolicyNumber }}</div>
                      } @else { <span style="color:var(--muted)">—</span> }
                    </td>
                    <td><a [routerLink]="['/patients', p.id]" class="btn btn-outline btn-sm"><i class="bi bi-eye"></i>View</a></td>
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
export class PatientsComponent implements OnInit {
  patients: PatientDto[] = [];
  loading = true;
  constructor(private patientService: PatientService, public auth: AuthService) {}
  ngOnInit() {
    this.patientService.getAll().subscribe({ next: data => { this.patients = data; this.loading = false; }, error: () => this.loading = false });
  }
}
