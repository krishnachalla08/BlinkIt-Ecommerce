import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  orderId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItemList: OrderItemResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/orders';

  readonly orders = signal<OrderResponse[]>([]);
  readonly isLoading = signal<boolean>(false);

  private getHeaders(): { headers: HttpHeaders } {
    let claimsStr = null;
    if (typeof localStorage !== 'undefined') {
      claimsStr = localStorage.getItem('claims');
    }
    const claims = claimsStr ? JSON.parse(claimsStr) : null;
    const sub = claims?.sub || '1'; 
    return {
      headers: new HttpHeaders().set('X-User-Id', sub)
    };
  }

  loadOrders() {
    this.isLoading.set(true);
    this.http.get<OrderResponse[]>(this.baseUrl, this.getHeaders()).subscribe({
      next: (response) => {
        this.orders.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.isLoading.set(false);
      }
    });
  }
}