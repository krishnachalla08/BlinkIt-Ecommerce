import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

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
  private router = inject(Router);
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

  // Bind the cache to the actual user ID so users never see each other's items
  private getCacheKey(): string {
    let sub = 'guest';
    if (typeof localStorage !== 'undefined') {
      const claimsStr = localStorage.getItem('claims');
      if (claimsStr) {
        try {
          sub = JSON.parse(claimsStr)?.sub || 'guest';
        } catch(e) {}
      }
    }
    return `cartItems_${sub}`;
  }

  private syncSessionStorage() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.getCacheKey(), JSON.stringify(this.cartItems()));
    }
  }

  // A complete sweep of any left-over carts across any session
  private wipeAllCartCaches() {
    if (typeof sessionStorage !== 'undefined') {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key === 'cartItems' || key.startsWith('cartItems_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => sessionStorage.removeItem(k));
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
      const cached = sessionStorage.getItem(this.getCacheKey());
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
    this.wipeAllCartCaches();
  }

  clearCart() {
    this.http.delete(`${this.baseUrl}/clear`, this.getHeaders()).subscribe({
      next: () => {
        this.cartItems.set([]);
        this.wipeAllCartCaches();
      },
      error: (err) => console.error('Error clearing cart', err)
    });
  }

  checkout() {
    const options = this.getHeaders();
    
    // OrderController expects an Authorization header for validating the token
    let token = 'mock-token';
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token') || 'mock-token';
    }
    options.headers = options.headers.set('Authorization', `Bearer ${token}`);

    // Call the order-service backend instead of just simulating with a cart clear
    return this.http.post<any>(`${environment.apiUrl}/orders/checkout`, {}, options).subscribe({
      next: () => {
        this.cartItems.set([]);
        this.wipeAllCartCaches();
        // Redirect to orders page and pass success state
        this.router.navigate(['/orders'], { state: { orderPlaced: true } });
      },
      error: (err) => {
        console.error('Error processing checkout', err);
        this.clearLocalCart(); // Failsafe clear local cache
      }
    });
  }
}
