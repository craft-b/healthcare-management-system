import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Provider } from '../models';

@Injectable({ providedIn: 'root' })
export class ProviderService {
  private readonly API = 'http://localhost:8080/api/providers';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Provider[]>(this.API);
  }
}
