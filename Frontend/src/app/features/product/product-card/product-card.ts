import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';

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

  onAddToCart(): void {
    console.log('Adding to cart:', this.product);
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

