import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createCategory`, category);
  }
}
