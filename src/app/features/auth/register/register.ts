import { Component } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [ReactiveFormsModule, RouterLink],

  templateUrl: './register.html',

  styleUrl: './register.css',
})
export class Register {
  registerForm!: FormGroup;

  submitted = false;

  showPassword = false;

  showConfirmPassword = false;

  isLoading = false;

  errorMessage = '';

  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-z\s]+$/)]],

        email: ['', [Validators.required, Validators.email]],

        password: ['', [Validators.required, Validators.minLength(6)]],

        confirmPassword: ['', [Validators.required]],
      },

      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  // =========================================
  // GETTERS
  // =========================================

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // =========================================
  // PASSWORD MATCH VALIDATOR
  // =========================================

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;

    const confirmPassword = control.get('confirmPassword')?.value;

    // Don't show mismatch until both fields have values

    if (!password || !confirmPassword) {
      return null;
    }

    if (password !== confirmPassword) {
      return {
        passwordMismatch: true,
      };
    }

    return null;
  }

  // =========================================
  // PASSWORD VISIBILITY
  // =========================================

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // =========================================
  // REGISTER
  // =========================================

  onRegister(): void {
    this.submitted = true;

    this.errorMessage = '';

    this.successMessage = '';

    // Validate form

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    // Only send fields required by backend

    const request = {
      name: this.name?.value.trim(),

      email: this.email?.value.trim().toLowerCase(),

      password: this.password?.value,
    };

    this.authService.register(request).subscribe({
      // ===================================
      // SUCCESS
      // ===================================

      next: (response) => {
        console.log('Registration successful:', response);

        this.isLoading = false;

        this.successMessage = 'Registration successful! Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },

      // ===================================
      // ERROR
      // ===================================

      error: (error) => {
        console.error('Registration failed:', error);

        this.isLoading = false;

        this.errorMessage = error?.error?.message || 'Registration failed. Please try again.';
      },
    });
  }

  // =========================================
  // GOOGLE LOGIN
  // =========================================

  continueWithGoogle(): void {
    console.log('Google login clicked');

    // Google authentication will be implemented here
  }
}
