import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InvoiceDto, InvoiceRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly API = 'http://localhost:8080/api/invoices';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<InvoiceDto[]>(this.API);
  }

  create(req: InvoiceRequest) {
    return this.http.post<InvoiceDto>(this.API, req);
  }

  pay(id: number) {
    return this.http.post<InvoiceDto>(`${this.API}/${id}/pay`, null);
  }

  submitClaim(id: number, claimNumber: string) {
    return this.http.post<InvoiceDto>(`${this.API}/${id}/claim`, { claimNumber });
  }
}
