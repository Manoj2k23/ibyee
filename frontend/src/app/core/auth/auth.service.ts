import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap, map } from 'rxjs';
import { ApiService } from '../services/api.service';

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER';
  name?: string; // Optional since schema doesn't strictly have name but UI might want it
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Using signals for reactive state
  currentUser = signal<User | null>(null);
  token = signal<string | null>(localStorage.getItem('token'));

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    // Attempt to restore session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.api.post<{success: boolean; data: AuthResponse}>('/auth/login', credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      }),
      map(res => res.data)
    );
  }

  register(data: any): Observable<any> {
    return this.api.post('/auth/register', data);
  }

  logout() {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  private setSession(authResult: AuthResponse) {
    this.token.set(authResult.token);
    this.currentUser.set(authResult.user);
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.router.navigate(['/dashboard']);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }
}
