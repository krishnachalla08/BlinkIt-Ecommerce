import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl + "/auth";

  constructor(private http: HttpClient) {}

  login(data:any){
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(data:any){
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  saveToken(token:string, name:string){
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
    }
  }

  getToken(){
    return typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;
  }

  getName(){
    return typeof localStorage !== 'undefined' ? localStorage.getItem("name") : null;
  }

  logout(){
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("claims"); // Keep for cleanup of old values
    }
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      // Check if token is expired. The 'exp' claim is a Unix timestamp (seconds).
      if (decoded.exp * 1000 < Date.now()) {
        this.logout();
        return null;
      }

      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout(); // Also logout on decoding error
      return null;
    }
  }

  getClaims(): any {
    // Always decode the token to get fresh claims and check for expiration.
    // The localStorage cache for claims can become stale.
    return this.decodeToken();
  }

  isLoggedIn(): boolean {
    // decodeToken will return null if the token is missing, invalid, or expired.
    // It also handles logging out the user.
    return !!this.decodeToken();
  }

  isAdmin(): boolean {
    const decoded = this.decodeToken();
    return decoded && (decoded.role === 'ADMIN' || decoded.role === 'admin');
  }

  getUserRole(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.role : null;
  }
}