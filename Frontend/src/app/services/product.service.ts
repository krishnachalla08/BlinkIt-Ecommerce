import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private baseUrl = environment.apiUrl + '/products';

  private productsCache$: Observable<Product[]> | null = null;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    if (!this.productsCache$) {
      this.productsCache$ = this.http.get<Product[]>(this.baseUrl).pipe(
        shareReplay(1)
      );
    }
    return this.productsCache$;
  }

  // Added so you can clear the cache when creating/updating products
  clearCache(): void {
    this.productsCache$ = null;
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createProduct`, product).pipe(
      tap(() => this.clearCache())
    );
  }
}
