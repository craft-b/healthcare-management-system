import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportDto } from '../models';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly API = 'http://localhost:8080/api/admin/reports';

  constructor(private http: HttpClient) {}

  generate(start: string, end: string) {
    return this.http.get<ReportDto>(this.API, { params: { start, end } });
  }
}
