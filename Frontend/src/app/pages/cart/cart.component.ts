import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart.component',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.loadCart();
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }
  
  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }
  
  clearCart() {
    this.cartService.clearCart();
  }

  checkout() {
    this.cartService.checkout();
    alert('Order placed successfully! 🚀');
    this.router.navigate(['/orders']);
  }
}
