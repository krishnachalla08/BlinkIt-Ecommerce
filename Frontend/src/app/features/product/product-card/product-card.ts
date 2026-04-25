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
  
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  get isOutOfStock(): boolean {
    return this.product?.quantity === 0;
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

  onToggleWishlist(): void {
    console.log('Toggling wishlist:', this.product);
  }

  @Output() quickView = new EventEmitter<any>();

  onQuickView(): void {
    console.log('Quick view for:', this.product);
    this.quickView.emit(this.product);
  }
}
