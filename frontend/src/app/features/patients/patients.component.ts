import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { PatientDto } from '../../core/models';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2>Patients</h2>
          <p class="page-subtitle">{{ patients.length }} registered patients</p>
        </div>
      </div>

      @if (loading) {
        <div class="spinner-center"><div class="spinner"></div></div>
      } @else if (patients.length === 0) {
        <div class="card">
          <div class="empty-state"><i class="bi bi-person-x"></i><p>No patient records found.</p></div>
        </div>
      } @else {
        <div class="card">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Patient</th>
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
                    <td>
                      <div style="display:flex;align-items:center;gap:.75rem">
                        <div class="patient-avatar">{{ initials(p.fullName) }}</div>
                        <div>
                          <div style="font-weight:600;font-size:.875rem">{{ p.fullName }}</div>
                          @if (p.allergies) {
                            <div style="font-size:.72rem;color:var(--danger);margin-top:.1rem">
                              <i class="bi bi-exclamation-triangle-fill"></i> {{ p.allergies }}
                            </div>
                          }
                        </div>
                      </div>
                    </td>
                    <td style="color:var(--muted);font-size:.8125rem">{{ p.dateOfBirth }}</td>
                    <td style="color:var(--muted);font-size:.8125rem">{{ p.gender }}</td>
                    <td style="font-size:.8125rem">{{ p.phone }}</td>
                    <td>
                      @if (p.insuranceProvider) {
                        <div style="font-size:.8125rem;font-weight:500">{{ p.insuranceProvider }}</div>
                        <div style="font-size:.72rem;color:var(--muted)">{{ p.insurancePolicyNumber }}</div>
                      } @else {
                        <span style="color:var(--muted-2)">—</span>
                      }
                    </td>
                    <td>
                      <a [routerLink]="['/patients', p.id]" class="btn btn-outline btn-sm">
                        <i class="bi bi-eye"></i>View
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
  `,
  styles: [`
    .patient-avatar {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: var(--navy-light);
      color: var(--navy);
      display: flex; align-items: center; justify-content: center;
      font-size: .7rem; font-weight: 800;
      flex-shrink: 0;
      letter-spacing: -.02em;
    }
  `]
})
export class PatientsComponent implements OnInit {
  patients: PatientDto[] = [];
  loading = true;

  constructor(private patientService: PatientService, public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.patientService.getAll().subscribe({
      next: data => {
        this.loading = false;
        if (this.auth.role === 'PATIENT' && data.length > 0) {
          this.router.navigate(['/patients', data[0].id]);
        } else {
          this.patients = data;
        }
      },
      error: () => this.loading = false
    });
  }

  initials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }
}
