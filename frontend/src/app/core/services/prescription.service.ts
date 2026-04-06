import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrescriptionDto, PrescriptionRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private readonly API = '/api/prescriptions';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<PrescriptionDto[]>(this.API);
  }

  create(req: PrescriptionRequest) {
    return this.http.post<PrescriptionDto>(this.API, req);
  }

  update(id: number, req: PrescriptionRequest) {
    return this.http.put<PrescriptionDto>(`${this.API}/${id}`, req);
  }

  sendToPharmacy(id: number) {
    return this.http.post<PrescriptionDto>(`${this.API}/${id}/send`, null);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
