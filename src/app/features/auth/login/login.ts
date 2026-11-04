import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  ngOnInit(): void {
    localStorage.removeItem('tasktracker_token');
    localStorage.removeItem('tasktracker_user');
  }
  submitted = false;

  isLoading = false;

  errorMessage = '';

  loginForm;
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], {
      replaceUrl: true,
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.submitted = true;

    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const request = {
      email: this.loginForm.value.email!,

      password: this.loginForm.value.password!,
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        this.isLoading = false;

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        console.error('Login failed:', error);

        this.isLoading = false;

        this.errorMessage = error?.error?.message || 'Invalid email or password';

        if (error.status === 401 || error.status === 400 || error.status === 403) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again later.';
        }
        this.cdr.markForCheck();
      },
    });
  }
}
