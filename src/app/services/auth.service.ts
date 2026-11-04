import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  userId: number;
  name: string;
  email: string;
  role: string;
  token: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = 'http://localhost:8080/api/auth';

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('tasktracker_token', response.token);
        }

        localStorage.setItem(
          'tasktracker_user',
          JSON.stringify({
            userId: response.userId,
            name: response.name,
            email: response.email,
            role: response.role,
          }),
        );
      }),
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    localStorage.removeItem('tasktracker_token');
    localStorage.removeItem('tasktracker_user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('tasktracker_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('tasktracker_token');
  }

  getUser(): any {
    const user = localStorage.getItem('tasktracker_user');

    return user ? JSON.parse(user) : null;
  }
}
