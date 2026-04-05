import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppointmentDto, AppointmentRequest, AppointmentStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly API = '/api/appointments';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<AppointmentDto[]>(this.API);
  }

  create(req: AppointmentRequest) {
    return this.http.post<AppointmentDto>(this.API, req);
  }

  updateStatus(id: number, status: AppointmentStatus) {
    return this.http.patch<AppointmentDto>(`${this.API}/${id}/status`, null, {
      params: { status }
    });
  }

  cancel(id: number) {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
