import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CartItem {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  totalPrice?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/cart'; // Adjust this to match your backend microservice route

  // Reactive state for the cart
  readonly cartItems = signal<CartItem[]>([]);
  readonly isLoading = signal<boolean>(false);

  // Helper to fetch the necessary X-User-Id header expected by the backend
  private getHeaders(): { headers: HttpHeaders } {
    const claimsStr = localStorage.getItem('claims');
    const claims = claimsStr ? JSON.parse(claimsStr) : null;
    const sub = claims?.sub || '1'; 
    return {
      headers: new HttpHeaders().set('X-User-Id', sub)
    };
  }

  constructor() {
    // Eagerly load the cart from session storage on instantiation
    this.loadCart();
  }

  private syncSessionStorage() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems()));
    }
  }

  // Automatically calculated totals
  readonly totalItems = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalPrice = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  loadCart(forceRefresh = false) {
    // Check session storage first if we aren't forcing a refresh
    if (!forceRefresh && typeof sessionStorage !== 'undefined') {
      const cached = sessionStorage.getItem('cartItems');
      if (cached) {
        try {
          this.cartItems.set(JSON.parse(cached));
          return; // Skip API call, use cached data
        } catch (e) {
          console.error('Error parsing cached cart', e);
        }
      }
    }

    // Prevent duplicate concurrent API calls
    if (this.isLoading()) return;

    this.isLoading.set(true);
    // CartController returns a CartResponse object, so we map .items (or fallback to response if it's already an array)
    this.http.get<any>(this.baseUrl, this.getHeaders()).subscribe({
      next: (response) => {
        this.cartItems.set(response.items || response);
        this.syncSessionStorage();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.isLoading.set(false);
      }
    });
  }

  addToCart(product: any) {
    const pId = product.id || product.productId;
    const payload = { productId: pId, quantity: 1 };
    
    this.http.post(`${this.baseUrl}/add`, payload, this.getHeaders()).subscribe({
      next: () => {
        // Update local signal state after successful backend call
        this.cartItems.update(items => {
          const existingItem = items.find(i => i.productId === pId);
          if (existingItem) {
            return items.map(i => i.productId === pId ? { ...i, quantity: i.quantity + 1 } : i);
          }
          return [...items, { 
            productId: pId, 
            productName: product.name || product.productName, 
            imageUrl: product.imageUrl, 
            price: product.price, 
            quantity: 1 
          }];
        });
        this.syncSessionStorage();
      },
      error: (err) => console.error('Error adding to cart', err)
    });
  }

  removeFromCart(productId: number) {
    this.http.delete(`${this.baseUrl}/${productId}`, this.getHeaders()).subscribe({
      next: () => {
        this.cartItems.update(items => items.filter(i => i.productId !== productId));
        this.syncSessionStorage();
      },
      error: (err) => console.error('Error removing from cart', err)
    });
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) return this.removeFromCart(productId);

    // Backend maps AddToCartRequest for updates too, meaning it needs productId in the body
    const payload = { productId, quantity };
    this.http.put(`${this.baseUrl}/update`, payload, this.getHeaders()).subscribe({
      next: () => {
        this.cartItems.update(items => items.map(i => i.productId === productId ? { ...i, quantity } : i));
        this.syncSessionStorage();
      },
      error: (err) => console.error('Error updating quantity', err)
    });
  }

  clearLocalCart() {
    this.cartItems.set([]);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('cartItems');
    }
  }

  clearCart() {
    this.http.delete(`${this.baseUrl}/clear`, this.getHeaders()).subscribe({
      next: () => {
        this.cartItems.set([]);
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('cartItems');
        }
      },
      error: (err) => console.error('Error clearing cart', err)
    });
  }
}
