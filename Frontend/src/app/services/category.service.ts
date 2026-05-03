import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.apiUrl + '/categories';
  private readonly cacheKey = 'farmNFreshCategories';
  private readonly cacheExpiryKey = 'farmNFreshCategoriesExpiry';
  private readonly cacheTtlMs = 10 * 60 * 1000; // 10 minutes

  constructor(private http: HttpClient) {}

  getAllCategories(forceRefresh = false): Observable<any> {
    if (!forceRefresh && typeof sessionStorage !== 'undefined') {
      const cached = sessionStorage.getItem(this.cacheKey);
      const expiry = sessionStorage.getItem(this.cacheExpiryKey);

      if (cached && expiry && Number(expiry) > Date.now()) {
        try {
          return of(JSON.parse(cached));
        } catch {
          this.clearCache();
        }
      }
    }

    return this.http.get(this.baseUrl).pipe(
      tap((data) => {
        this.setCache(data);
      })
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createCategory`, category).pipe(
      tap(() => this.clearCache())
    );
  }

  clearCache(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(this.cacheKey);
      sessionStorage.removeItem(this.cacheExpiryKey);
    }
  }

  private setCache(data: any): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.cacheKey, JSON.stringify(data));
      sessionStorage.setItem(this.cacheExpiryKey, (Date.now() + this.cacheTtlMs).toString());
    }
  }
}
