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
      <div style="margin-bottom:2rem">
        <h3 style="margin-bottom:.2rem">Reporting Dashboard</h3>
        <p style="color:var(--muted);margin:0;font-size:.875rem">Administrator analytics — generate reports for any date range</p>
      </div>

      <div class="card mb-4">
        <div class="card-header"><i class="bi bi-funnel"></i>Report Filters</div>
        <div class="card-body">
          <form [formGroup]="filterForm" (ngSubmit)="generate()">
            <div class="form-row cols-3">
              <div>
                <label class="form-label">Start Date</label>
                <input type="date" class="form-control" formControlName="start" />
              </div>
              <div>
                <label class="form-label">End Date</label>
                <input type="date" class="form-control" formControlName="end" />
              </div>
              <div style="display:flex;align-items:flex-end">
                <button type="submit" class="btn btn-navy btn-block" [disabled]="loading">
                  @if (loading) { <span class="spinner" style="width:16px;height:16px;border-width:2px"></span> }
                  <i class="bi bi-search"></i>Generate Report
                </button>
              </div>
            </div>
            @if (error) { <div class="alert alert-danger mt-2"><i class="bi bi-exclamation-circle-fill"></i>{{ error }}</div> }
          </form>
        </div>
      </div>

      @if (report) {
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem">
          <div class="stat-card">
            <div class="stat-icon navy"><i class="bi bi-people"></i></div>
            <div><div class="stat-value">{{ report.totalPatients }}</div><div class="stat-label">Total Patients</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue"><i class="bi bi-calendar-check"></i></div>
            <div><div class="stat-value">{{ report.totalAppointments }}</div><div class="stat-label">All Appointments</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange"><i class="bi bi-calendar-event"></i></div>
            <div><div class="stat-value">{{ report.appointmentsInPeriod }}</div><div class="stat-label">In Period</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><i class="bi bi-currency-dollar"></i></div>
            <div><div class="stat-value" style="font-size:1.4rem">{{ report.revenueInPeriod | currency }}</div><div class="stat-label">Revenue in Period</div></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header" style="justify-content:space-between">
            <span><i class="bi bi-table"></i>Report Summary · {{ report.periodStart }} to {{ report.periodEnd }}</span>
            <button class="btn btn-outline btn-sm" (click)="download()"><i class="bi bi-download"></i>Export CSV</button>
          </div>
          <div class="card-body" style="padding:0">
            <table class="table" style="margin:0">
              <tbody>
                <tr><td style="font-weight:600;color:var(--navy);width:55%">Total Registered Patients</td><td>{{ report.totalPatients }}</td></tr>
                <tr><td style="font-weight:600;color:var(--navy)">Total Appointments (All Time)</td><td>{{ report.totalAppointments }}</td></tr>
                <tr><td style="font-weight:600;color:var(--navy)">Appointments in Selected Period</td><td>{{ report.appointmentsInPeriod }}</td></tr>
                <tr><td style="font-weight:600;color:var(--navy)">Revenue in Selected Period</td><td style="font-weight:700;color:var(--success)">{{ report.revenueInPeriod | currency }}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      } @else if (!loading) {
        <div class="card"><div class="empty-state"><i class="bi bi-bar-chart"></i><p>Select a date range and generate a report to view analytics.</p></div></div>
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
    this.filterForm = this.fb.group({ start: [monthAgo, Validators.required], end: [today, Validators.required] });
  }

  generate() {
    if (this.filterForm.invalid) return;
    this.loading = true; this.error = '';
    const { start, end } = this.filterForm.value;
    this.reportService.generate(start, end).subscribe({
      next: data => { this.report = data; this.loading = false; },
      error: () => { this.error = 'Failed to generate report.'; this.loading = false; }
    });
  }

  download() {
    if (!this.report) return;
    const csv = ['Metric,Value', `Total Patients,${this.report.totalPatients}`, `Total Appointments,${this.report.totalAppointments}`, `Appointments in Period,${this.report.appointmentsInPeriod}`, `Revenue in Period,$${this.report.revenueInPeriod}`, `Period Start,${this.report.periodStart}`, `Period End,${this.report.periodEnd}`].join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `hms-report-${this.report.periodStart}-to-${this.report.periodEnd}.csv` });
    a.click(); URL.revokeObjectURL(a.href);
  }
}
