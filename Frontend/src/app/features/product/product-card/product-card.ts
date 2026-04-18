import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  onAddToCart(): void {
    console.log('Adding to cart:', this.product);
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
