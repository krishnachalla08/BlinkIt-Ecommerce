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

  saveToken(token:string){
    localStorage.setItem("token", token);
    const decoded = this.decodeToken();
    if (decoded) {
      sessionStorage.setItem("claims", JSON.stringify(decoded));
    }
  }

  getToken(){
    return localStorage.getItem("token");
  }

  logout(){
    localStorage.removeItem("token");
    sessionStorage.removeItem("claims");
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getClaims(): any {
    const claims = sessionStorage.getItem("claims");
    return claims ? JSON.parse(claims) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
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