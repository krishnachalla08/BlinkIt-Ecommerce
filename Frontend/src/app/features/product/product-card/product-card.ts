import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
})
export class ProductCard  {
  @Input() product: any;
  showQuickView = false;
  isWishlisted = false;
  
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  get isOutOfStock(): boolean {
    return this.product?.quantity === 0;
  }

  get cartItem() {
    return this.cartService.cartItems().find(item => item.productId === (this.product?.id || this.product?.productId));
  }

  get cartQuantity(): number {
    return this.cartItem?.quantity || 0;
  }

  onAddToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.isOutOfStock) {
      return; // Prevent adding to cart if out of stock
    }

    this.cartService.addToCart(this.product);
  }

  onIncrement(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const qty = this.cartQuantity;
    if (qty === 0) {
      this.onAddToCart();
    } else {
      this.cartService.updateQuantity(this.product.id || this.product.productId, qty + 1);
    }
  }

  onDecrement(): void {
    const qty = this.cartQuantity;
    if (qty > 0) {
      this.cartService.updateQuantity(this.product.id || this.product.productId, qty - 1);
    }
  }

  onToggleWishlist(): void {
    this.isWishlisted = !this.isWishlisted;
  }

  @Output() quickView = new EventEmitter<any>();

  onQuickView(): void {
    this.quickView.emit(this.product);
  }
}
