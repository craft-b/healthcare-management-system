import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { InvoiceService } from '../../core/services/invoice.service';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { InvoiceDto, PatientDto } from '../../core/models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe, TitleCasePipe],
  template: `
    <div class="page-container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem">
        <div>
          <h3 style="margin-bottom:.2rem">Billing & Invoices</h3>
          <p style="color:var(--muted);margin:0;font-size:.875rem">{{ invoices.length }} invoice(s) · {{ pendingCount }} pending</p>
        </div>
        @if (auth.role !== 'PATIENT') {
          <button class="btn btn-primary" (click)="showForm = !showForm"><i class="bi bi-plus-lg"></i>Create Invoice</button>
        }
      </div>

      @if (showForm) {
        <div class="card mb-4">
          <div class="card-header"><i class="bi bi-file-earmark-plus"></i>New Invoice</div>
          <div class="card-body">
            <form [formGroup]="invoiceForm" (ngSubmit)="createInvoice()">
              <div class="form-row cols-3">
                <div>
                  <label class="form-label">Patient</label>
                  <select class="form-select" formControlName="patientId">
                    <option value="">Select patient</option>
                    @for (p of patients; track p.id) { <option [value]="p.id">{{ p.fullName }}</option> }
                  </select>
                </div>
                <div>
                  <label class="form-label">Service Description</label>
                  <input type="text" class="form-control" formControlName="serviceDescription" placeholder="e.g. Consultation, Lab Test" />
                </div>
                <div>
                  <label class="form-label">Amount (USD)</label>
                  <input type="number" class="form-control" formControlName="amount" min="0.01" step="0.01" placeholder="0.00" />
                </div>
              </div>
              @if (formError) { <div class="alert alert-danger mt-2"><i class="bi bi-exclamation-circle-fill"></i>{{ formError }}</div> }
              <div style="margin-top:1rem;display:flex;gap:.75rem">
                <button type="submit" class="btn btn-primary" [disabled]="submitting">
                  @if (submitting) { <span class="spinner" style="width:16px;height:16px;border-width:2px"></span> }
                  Create Invoice
                </button>
                <button type="button" class="btn btn-ghost" (click)="showForm = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      }

      @if (loading) {
        <div class="spinner-center"><div class="spinner"></div></div>
      } @else if (invoices.length === 0) {
        <div class="card"><div class="empty-state"><i class="bi bi-receipt"></i><p>No invoices found.</p></div></div>
      } @else {
        <div class="card">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  @if (auth.role !== 'PATIENT') { <th>Patient</th> }
                  <th>Date</th><th>Service</th><th>Amount</th><th>Status</th><th>Claim #</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (inv of invoices; track inv.id) {
                  <tr>
                    @if (auth.role !== 'PATIENT') { <td style="font-weight:600">{{ inv.patientName }}</td> }
                    <td style="font-size:.875rem;color:var(--muted)">{{ inv.issuedAt | date:'MMM d, y' }}</td>
                    <td style="font-size:.875rem">{{ inv.serviceDescription }}</td>
                    <td style="font-weight:700;color:var(--navy)">{{ inv.amount | currency }}</td>
                    <td><span class="badge" [class]="statusBadge(inv.status)">{{ inv.status | titlecase }}</span></td>
                    <td style="font-size:.8rem;color:var(--muted)">{{ inv.insuranceClaimNumber || '—' }}</td>
                    <td>
                      <div style="display:flex;gap:.4rem;flex-wrap:wrap">
                        @if (inv.status === 'PENDING') {
                          <button class="btn btn-success btn-sm" (click)="pay(inv)"><i class="bi bi-credit-card"></i>Pay</button>
                          <button class="btn btn-outline btn-sm" (click)="submitClaim(inv)"><i class="bi bi-file-earmark-text"></i>Claim</button>
                        }
                        @if (inv.status === 'PAID') {
                          <span style="font-size:.8rem;color:var(--success);font-weight:600"><i class="bi bi-check-circle-fill"></i> Paid {{ inv.paidAt | date:'MMM d' }}</span>
                        }
                      </div>
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

  get pendingCount() { return this.invoices.filter(i => i.status === 'PENDING').length; }

  constructor(private fb: FormBuilder, private invoiceService: InvoiceService, private patientService: PatientService, public auth: AuthService) {}

  ngOnInit() {
    this.invoiceForm = this.fb.group({ patientId: ['', Validators.required], serviceDescription: ['', Validators.required], amount: ['', [Validators.required, Validators.min(0.01)]] });
    this.invoiceService.getAll().subscribe({ next: data => { this.invoices = data; this.loading = false; }, error: () => this.loading = false });
    if (this.auth.role !== 'PATIENT') { this.patientService.getAll().subscribe(data => this.patients = data); }
  }

  createInvoice() {
    if (this.invoiceForm.invalid) { this.invoiceForm.markAllAsTouched(); return; }
    this.submitting = true; this.formError = '';
    const val = this.invoiceForm.value;
    this.invoiceService.create({ patientId: Number(val.patientId), serviceDescription: val.serviceDescription, amount: val.amount }).subscribe({
      next: inv => { this.invoices.unshift(inv); this.invoiceForm.reset(); this.showForm = false; this.submitting = false; },
      error: () => { this.formError = 'Failed to create invoice.'; this.submitting = false; }
    });
  }

  pay(inv: InvoiceDto) {
    if (!confirm(`Pay ${inv.amount} for "${inv.serviceDescription}"?`)) return;
    this.invoiceService.pay(inv.id!).subscribe(updated => { const i = this.invoices.findIndex(x => x.id === inv.id); if (i !== -1) this.invoices[i] = updated; });
  }

  submitClaim(inv: InvoiceDto) {
    const claimNumber = prompt('Enter insurance claim number:');
    if (!claimNumber) return;
    this.invoiceService.submitClaim(inv.id!, claimNumber).subscribe(updated => { const i = this.invoices.findIndex(x => x.id === inv.id); if (i !== -1) this.invoices[i] = updated; });
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = { PENDING: 'badge-warning', PAID: 'badge-success', CANCELLED: 'badge-danger', CLAIM_SUBMITTED: 'badge-info', CLAIM_APPROVED: 'badge-success', CLAIM_DENIED: 'badge-danger' };
    return 'badge ' + (map[status] ?? 'badge-muted');
  }
}
