import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink  } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {

  token = '';
  message = '';
  showPassword = false;
  resetForm!: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.message = 'Invalid or missing reset token.';
    }
  }

  resetPassword(): void {
    if (this.resetForm.invalid || !this.token) return;

    this.http.post<any>(
      'http://localhost:8080/api/auth/reset-password',
      {
        token: this.token,
        newPassword: this.resetForm.value.newPassword
      }
    ).subscribe({
      next: (response) => {
        this.message = response.message || 'Password reset successful!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.message = error.error?.message || 'Unable to reset password.';
      }
    });
  }
}