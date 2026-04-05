import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PatientDto } from '../models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly API = 'http://localhost:8080/api/patients';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<PatientDto[]>(this.API);
  }

  getById(id: number) {
    return this.http.get<PatientDto>(`${this.API}/${id}`);
  }

  create(dto: PatientDto) {
    return this.http.post<PatientDto>(this.API, dto);
  }

  update(id: number, dto: PatientDto) {
    return this.http.put<PatientDto>(`${this.API}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
