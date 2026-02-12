
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { InputComponent } from '../../../shared/components/input.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
        <p class="mt-2 text-sm text-gray-500">
          Don't have an account?
          <a routerLink="/register" class="font-semibold text-yellow-600 hover:text-yellow-500 transition-colors">
            Sign up
          </a>
        </p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <div class="space-y-5">
          <app-input
            formControlName="email"
            label="Email"
            type="email"
            placeholder="name@company.com"
            [error]="getError('email')"
            icon="pi pi-envelope" 
            [required]="true"
          ></app-input>

          <app-input
            formControlName="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            [error]="getError('password')"
            [required]="true"
          ></app-input>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" 
                   class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer">
            <label for="remember-me" class="ml-2 block text-sm text-gray-600 cursor-pointer">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-yellow-600 hover:text-yellow-500">
              Forgot password?
            </a>
          </div>
        </div>

        <!-- Error Message Display -->
        @if (errorMessage) {
          <div class="rounded-lg bg-red-50 p-4 border border-red-100 animate-fade-in">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        }

        <div class="pt-2">
          <app-button
            type="submit"
            [loading]="isLoading"
            [disabled]="loginForm.invalid"
            [fullWidth]="true"
            variant="primary"
            class="w-full shadow-lg shadow-yellow-500/20"
          >
            Sign in
          </app-button>
        </div>

      </form>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  getError(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return `${controlName} is required`;
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
    }
    return '';
  }

  onSubmit() {
    this.errorMessage = '';
    
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error("Login failed", err);
          
          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (err.status === 401) {
            this.errorMessage = 'Invalid email or password. Please check your credentials.';
          } else if (err.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please try again later.';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
