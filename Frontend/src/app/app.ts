import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  authService = inject(AuthService);
  cartService = inject(CartService);
  name : string | null = null;
  isAccountMenuOpen = false;
  isLoggedIn = false;
  userClaims: any = null;

  protected readonly title = signal('Farm N Fresh');

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log('Navigation ended:', event.url);
      // Dynamically check auth state on every route change
      this.checkAuthState();
    });
  }

  ngOnInit() {
    // Check initial auth state
    this.checkAuthState();
  }

  // Call this whenever navigation happens or auth state might change
  checkAuthState() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userClaims = this.authService.getClaims();
      this.name = this.authService.getName();
    }
  }

  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  closeAccountMenu() {
    // Delay closing to allow click events on dropdown items to fire and route correctly
    setTimeout(() => {
      this.isAccountMenuOpen = false;
    }, 150);
  }

  logout() {
    this.authService.logout();
    this.cartService.clearLocalCart();
    this.isLoggedIn = false;
    this.name = null;
    this.userClaims = null;
    this.isAccountMenuOpen = false;
    this.router.navigate(['/login']);
  }
}
