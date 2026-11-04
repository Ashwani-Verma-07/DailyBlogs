import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  message = '';
  isLoading = false;
  isSuccess = false;

  private fb = inject(FormBuilder);

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
  ) {}

  sendResetLink(): void {
    if (this.forgotForm.invalid || this.isLoading) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.message = '';

    const email = this.forgotForm.value.email;

    this.http.post<any>('http://localhost:8080/api/auth/forgot-password', { email }).subscribe({
      next: (response) => {
        this.message = response.message || 'Password reset instructions have been sent.';
        this.isSuccess = true;
        this.isLoading = false;
          this.cdr.detectChanges();
      },

      error: (error) => {
        this.message = error.error?.message || 'Unable to process your request. Please try again.';

        this.isSuccess = false;
        this.isLoading = false;
          this.cdr.detectChanges();
      },
       
    });
  }
}
