
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { InputComponent } from '../../../shared/components/input.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h2>
        <p class="mt-2 text-sm text-gray-500">
          Already have an account?
          <a routerLink="/login" class="font-semibold text-yellow-600 hover:text-yellow-500 transition-colors">
            Sign in
          </a>
        </p>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
        
        <app-input
          formControlName="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          [error]="getError('name')"
          [required]="true"
        ></app-input>

        <app-input
          formControlName="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          [error]="getError('email')"
          [required]="true"
        ></app-input>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <app-input
            formControlName="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            [error]="getError('password')"
            [required]="true"
          ></app-input>

          <app-input
            formControlName="confirmPassword"
            label="Confirm"
            type="password"
            placeholder="••••••••"
            [error]="getError('confirmPassword')"
            [required]="true"
          ></app-input>
        </div>

        <!-- Role Selection -->
        <div class="pt-2">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Account Type <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-4">
            <label class="relative flex items-center justify-center p-3 rounded-lg border cursor-not-allowed bg-gray-50 border-gray-200 opacity-60">
              <input 
                type="radio" 
                formControlName="role" 
                value="MANAGER" 
                class="sr-only"
                [disabled]="true"
              />
              <span class="text-sm font-medium text-gray-500">Manager</span>
            </label>

            <label class="relative flex items-center justify-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-all"
                   [class.border-yellow-500]="registerForm.get('role')?.value === 'ADMIN'"
                   [class.ring-1]="registerForm.get('role')?.value === 'ADMIN'"
                   [class.ring-yellow-500]="registerForm.get('role')?.value === 'ADMIN'"
                   [class.bg-yellow-50]="registerForm.get('role')?.value === 'ADMIN'"
                   [class.border-gray-300]="registerForm.get('role')?.value !== 'ADMIN'">
              <input 
                type="radio" 
                formControlName="role" 
                value="ADMIN" 
                class="sr-only"
              />
              <span class="text-sm font-medium" 
                    [class.text-yellow-700]="registerForm.get('role')?.value === 'ADMIN'"
                    [class.text-gray-900]="registerForm.get('role')?.value !== 'ADMIN'">Admin</span>
            </label>
          </div>
          <p class="mt-2 text-xs text-gray-500 text-center">
            Default role <strong>Admin</strong> is selected.
          </p>
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

        <!-- Success Message Display -->
        @if (successMessage) {
          <div class="rounded-lg bg-green-50 p-4 border border-green-100 animate-fade-in">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
              </div>
            </div>
          </div>
        }

        <div class="pt-4">
          <app-button
            type="submit"
            [loading]="isLoading"
            [disabled]="registerForm.invalid"
            [fullWidth]="true"
            variant="primary"
            class="w-full shadow-lg shadow-yellow-500/20"
          >
            Create Account
          </app-button>
        </div>

      </form>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['ADMIN', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  getError(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return `${this.formatFieldName(controlName)} is required`;
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['minlength']) {
        if (controlName === 'password') return 'Password must be at least 6 characters';
        if (controlName === 'name') return 'Name must be at least 2 characters';
      }
      if (control.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  private formatFieldName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.valid) {
      this.isLoading = true;
      
      const { confirmPassword, ...registerData } = this.registerForm.value;
      
      this.authService.register(registerData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Account created successfully! Redirecting to login...';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('Registration failed', err);
          
          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (err.status === 409) {
            this.errorMessage = 'An account with this email already exists.';
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
