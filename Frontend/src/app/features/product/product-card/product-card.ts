import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
})
export class ProductCard {
  @Input() product: any;

  onAddToCart(): void {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', this.product);
  }

  onToggleWishlist(): void {
    // TODO: Implement wishlist functionality
    console.log('Toggling wishlist:', this.product);
  }

  onQuickView(): void {
    // TODO: Implement quick view modal
    console.log('Quick view:', this.product);
  }
}
