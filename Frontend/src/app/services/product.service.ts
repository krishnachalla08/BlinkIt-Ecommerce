import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private baseUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createProduct`, product);
  }
}
