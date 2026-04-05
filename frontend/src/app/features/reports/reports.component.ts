import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ReportService } from '../../core/services/report.service';
import { ReportDto } from '../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <div class="page-container">
      <div class="mb-4">
        <h3 class="fw-bold mb-0"><i class="bi bi-bar-chart-line me-2"></i>Reporting Dashboard</h3>
        <small class="text-muted">Administrator view — generate reports for any date range</small>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-header py-3">Report Filters</div>
        <div class="card-body">
          <form [formGroup]="filterForm" (ngSubmit)="generate()">
            <div class="row g-3 align-items-end">
              <div class="col-md-4">
                <label class="form-label">Start Date</label>
                <input type="date" class="form-control" formControlName="start" />
              </div>
              <div class="col-md-4">
                <label class="form-label">End Date</label>
                <input type="date" class="form-control" formControlName="end" />
              </div>
              <div class="col-md-4">
                <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
                  @if (loading) { <span class="spinner-border spinner-border-sm me-2"></span> }
                  <i class="bi bi-search me-1"></i>Generate Report
                </button>
              </div>
            </div>
            @if (error) {
              <div class="alert alert-danger mt-3 py-2">{{ error }}</div>
            }
          </form>
        </div>
      </div>

      <!-- Summary Charts / Stats -->
      @if (report) {
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="card border-primary h-100">
              <div class="card-body text-center">
                <i class="bi bi-people text-primary" style="font-size:2.5rem"></i>
                <h3 class="fw-bold mt-2">{{ report.totalPatients }}</h3>
                <p class="text-muted mb-0">Total Patients</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-success h-100">
              <div class="card-body text-center">
                <i class="bi bi-calendar-check text-success" style="font-size:2.5rem"></i>
                <h3 class="fw-bold mt-2">{{ report.totalAppointments }}</h3>
                <p class="text-muted mb-0">Total Appointments</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-info h-100">
              <div class="card-body text-center">
                <i class="bi bi-calendar-event text-info" style="font-size:2.5rem"></i>
                <h3 class="fw-bold mt-2">{{ report.appointmentsInPeriod }}</h3>
                <p class="text-muted mb-0">Appointments in Period</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card border-warning h-100">
              <div class="card-body text-center">
                <i class="bi bi-currency-dollar text-warning" style="font-size:2.5rem"></i>
                <h3 class="fw-bold mt-2">{{ report.revenueInPeriod | currency }}</h3>
                <p class="text-muted mb-0">Revenue in Period</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center py-3">
            <span>
              Report Period: <strong>{{ report.periodStart }}</strong> — <strong>{{ report.periodEnd }}</strong>
            </span>
            <button class="btn btn-outline-secondary btn-sm" (click)="download()">
              <i class="bi bi-download me-1"></i>Download Report
            </button>
          </div>
          <div class="card-body">
            <table class="table table-bordered mb-0">
              <tbody>
                <tr>
                  <th class="table-light" style="width:50%">Total Registered Patients</th>
                  <td>{{ report.totalPatients }}</td>
                </tr>
                <tr>
                  <th class="table-light">Total Appointments (All Time)</th>
                  <td>{{ report.totalAppointments }}</td>
                </tr>
                <tr>
                  <th class="table-light">Appointments in Selected Period</th>
                  <td>{{ report.appointmentsInPeriod }}</td>
                </tr>
                <tr>
                  <th class="table-light">Revenue in Selected Period</th>
                  <td>{{ report.revenueInPeriod | currency }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      } @else if (!loading) {
        <div class="card text-center py-5">
          <i class="bi bi-bar-chart text-muted" style="font-size:3rem"></i>
          <p class="text-muted mt-2">Select a date range and click Generate Report to view analytics.</p>
        </div>
      }
    </div>
  `
})
export class ReportsComponent {
  filterForm: FormGroup;
  report: ReportDto | null = null;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    const today = new Date().toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    this.filterForm = this.fb.group({
      start: [monthAgo, Validators.required],
      end: [today, Validators.required]
    });
  }

  generate() {
    if (this.filterForm.invalid) return;
    this.loading = true;
    this.error = '';
    const { start, end } = this.filterForm.value;
    this.reportService.generate(start, end).subscribe({
      next: data => { this.report = data; this.loading = false; },
      error: () => { this.error = 'Failed to generate report.'; this.loading = false; }
    });
  }

  download() {
    if (!this.report) return;
    const csv = [
      'Metric,Value',
      `Total Patients,${this.report.totalPatients}`,
      `Total Appointments,${this.report.totalAppointments}`,
      `Appointments in Period,${this.report.appointmentsInPeriod}`,
      `Revenue in Period,$${this.report.revenueInPeriod}`,
      `Period Start,${this.report.periodStart}`,
      `Period End,${this.report.periodEnd}`
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hms-report-${this.report.periodStart}-to-${this.report.periodEnd}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
