import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  //State management via Signal
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  //Reactive Form setup for angular 21
  loginForm = this.fb.group({
    emailOrEmpId: [''],
    password: [''],
    rememberMe: [false],
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((prevValue) => !prevValue);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { emailOrEmpId, password, rememberMe } = this.loginForm.getRawValue();
    this.router.navigate(['/main-layout']);
    // this.authService.login(emailOrEmpId, password, rememberMe).subscribe({
    //   next: () => {
    //     // this.isLoading.set(false);
    //     this.router.navigate(['/dashboard']);
    //   },
    //   error: (error: any) => {
    //     this.isLoading.set(false);
    //     this.errorMessage.set(error.message || 'An error occurred during login. Please try again.');
    //   },
    // });
  }
}
