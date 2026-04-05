import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { InvoiceService } from '../../core/services/invoice.service';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { InvoiceDto, PatientDto } from '../../core/models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe],
  template: `
    <div class="page-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold mb-0"><i class="bi bi-receipt me-2"></i>Billing & Invoices</h3>
        @if (auth.role === 'ADMIN' || auth.role === 'PROVIDER') {
          <button class="btn btn-primary" (click)="showForm = !showForm">
            <i class="bi bi-plus-lg me-1"></i>Create Invoice
          </button>
        }
      </div>

      <!-- Create Invoice Form (Admin/Provider) -->
      @if (showForm) {
        <div class="card mb-4">
          <div class="card-header py-3">New Invoice</div>
          <div class="card-body">
            <form [formGroup]="invoiceForm" (ngSubmit)="createInvoice()">
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Patient</label>
                  <select class="form-select" formControlName="patientId">
                    <option value="">Select patient</option>
                    @for (p of patients; track p.id) {
                      <option [value]="p.id">{{ p.fullName }}</option>
                    }
                  </select>
                </div>
                <div class="col-md-5">
                  <label class="form-label">Service Description</label>
                  <input type="text" class="form-control" formControlName="serviceDescription" placeholder="e.g. Consultation, Lab Test" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Amount ($)</label>
                  <input type="number" class="form-control" formControlName="amount" min="0.01" step="0.01" />
                </div>
              </div>
              @if (formError) {
                <div class="alert alert-danger mt-3 py-2">{{ formError }}</div>
              }
              <div class="mt-3">
                <button type="submit" class="btn btn-success me-2" [disabled]="submitting">
                  @if (submitting) { <span class="spinner-border spinner-border-sm me-2"></span> }
                  Create Invoice
                </button>
                <button type="button" class="btn btn-outline-secondary" (click)="showForm = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Invoice Table -->
      @if (loading) {
        <div class="spinner-center"><div class="spinner-border text-primary"></div></div>
      } @else if (invoices.length === 0) {
        <div class="card text-center py-5">
          <i class="bi bi-receipt text-muted" style="font-size:3rem"></i>
          <p class="text-muted mt-2">No invoices found.</p>
        </div>
      } @else {
        <div class="card">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  @if (auth.role !== 'PATIENT') { <th>Patient</th> }
                  <th>Date</th>
                  <th>Service Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Claim #</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (inv of invoices; track inv.id) {
                  <tr>
                    @if (auth.role !== 'PATIENT') { <td>{{ inv.patientName }}</td> }
                    <td>{{ inv.issuedAt | date:'mediumDate' }}</td>
                    <td>{{ inv.serviceDescription }}</td>
                    <td class="fw-semibold">{{ inv.amount | currency }}</td>
                    <td><span class="badge" [class]="statusBadge(inv.status)">{{ inv.status }}</span></td>
                    <td>{{ inv.insuranceClaimNumber || '—' }}</td>
                    <td>
                      @if (inv.status === 'PENDING') {
                        <button class="btn btn-sm btn-success me-1" (click)="pay(inv)">
                          <i class="bi bi-credit-card me-1"></i>Pay
                        </button>
                        <button class="btn btn-sm btn-outline-primary" (click)="submitClaim(inv)">
                          <i class="bi bi-file-earmark-text me-1"></i>Claim
                        </button>
                      }
                      @if (inv.status === 'PAID') {
                        <span class="text-success"><i class="bi bi-check-circle me-1"></i>Paid {{ inv.paidAt | date:'shortDate' }}</span>
                      }
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
export class BillingComponent implements OnInit {
  invoices: InvoiceDto[] = [];
  patients: PatientDto[] = [];
  invoiceForm!: FormGroup;
  loading = true;
  showForm = false;
  submitting = false;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private patientService: PatientService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.invoiceForm = this.fb.group({
      patientId: ['', Validators.required],
      serviceDescription: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
    this.invoiceService.getAll().subscribe({
      next: data => { this.invoices = data; this.loading = false; },
      error: () => this.loading = false
    });
    if (this.auth.role !== 'PATIENT') {
      this.patientService.getAll().subscribe(data => this.patients = data);
    }
  }

  createInvoice() {
    if (this.invoiceForm.invalid) { this.invoiceForm.markAllAsTouched(); return; }
    this.submitting = true;
    this.formError = '';
    const val = this.invoiceForm.value;
    this.invoiceService.create({ patientId: Number(val.patientId), serviceDescription: val.serviceDescription, amount: val.amount }).subscribe({
      next: inv => {
        this.invoices.unshift(inv);
        this.invoiceForm.reset();
        this.showForm = false;
        this.submitting = false;
      },
      error: () => { this.formError = 'Failed to create invoice.'; this.submitting = false; }
    });
  }

  pay(inv: InvoiceDto) {
    if (!confirm(`Pay $${inv.amount} for "${inv.serviceDescription}"?`)) return;
    this.invoiceService.pay(inv.id!).subscribe(updated => {
      const idx = this.invoices.findIndex(i => i.id === inv.id);
      if (idx !== -1) this.invoices[idx] = updated;
    });
  }

  submitClaim(inv: InvoiceDto) {
    const claimNumber = prompt('Enter insurance claim number:');
    if (!claimNumber) return;
    this.invoiceService.submitClaim(inv.id!, claimNumber).subscribe(updated => {
      const idx = this.invoices.findIndex(i => i.id === inv.id);
      if (idx !== -1) this.invoices[idx] = updated;
    });
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-warning text-dark',
      PAID: 'bg-success',
      CANCELLED: 'bg-danger',
      CLAIM_SUBMITTED: 'bg-info',
      CLAIM_APPROVED: 'bg-success',
      CLAIM_DENIED: 'bg-danger'
    };
    return `badge ${map[status] ?? 'bg-secondary'}`;
  }
}
