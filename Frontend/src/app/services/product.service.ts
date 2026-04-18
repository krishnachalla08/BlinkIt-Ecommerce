import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private baseUrl = environment.apiUrl + '/products';

 private productsCache: Product[] | null = null;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    if (this.productsCache) {
    return of(this.productsCache);
  }

  return this.http.get<Product[]>(this.baseUrl).pipe(
    tap(data => this.productsCache = data)
  );
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createProduct`, product);
  }
}
