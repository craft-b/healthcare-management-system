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
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0">
          <i class="bi bi-people me-2"></i>
          {{ auth.role === 'PATIENT' ? 'My Profile' : 'Patients' }}
        </h3>
      </div>

      @if (loading) {
        <div class="spinner-center"><div class="spinner-border text-primary"></div></div>
      } @else if (patients.length === 0) {
        <div class="card text-center py-5">
          <i class="bi bi-person-x text-muted" style="font-size:3rem"></i>
          <p class="text-muted mt-2">No patient records found.</p>
        </div>
      } @else {
        <div class="card">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Insurance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (p of patients; track p.id) {
                  <tr>
                    <td class="fw-semibold">{{ p.fullName }}</td>
                    <td>{{ p.dateOfBirth }}</td>
                    <td>{{ p.gender }}</td>
                    <td>{{ p.phone }}</td>
                    <td>{{ p.insuranceProvider || '—' }}</td>
                    <td>
                      <a [routerLink]="['/patients', p.id]" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-eye me-1"></i>View
                      </a>
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
export class PatientsComponent implements OnInit {
  patients: PatientDto[] = [];
  loading = true;

  constructor(private patientService: PatientService, public auth: AuthService) {}

  ngOnInit() {
    this.patientService.getAll().subscribe({
      next: data => { this.patients = data; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
