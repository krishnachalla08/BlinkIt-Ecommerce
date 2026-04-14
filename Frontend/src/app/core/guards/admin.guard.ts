import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('AdminGuard: Checking admin access...'+this.authService.isAdmin());
    if (this.authService.isAdmin()) {
      return true;
    } else {
      // Redirect to unauthorized page instead of showing alert
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
