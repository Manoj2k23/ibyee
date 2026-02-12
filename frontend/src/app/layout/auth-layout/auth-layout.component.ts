
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center" 
         style="background-image: url('https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80');">
      
      <!-- Overlay with blur -->
      <div class="absolute inset-0 bg-gray-50/80 backdrop-blur-sm z-0"></div>
      
      <!-- Card Container -->
      <div class="relative z-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="flex flex-col items-center mb-8">
          <div class="flex items-center gap-2">
            <svg class="h-10 w-10 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 20V4" />
              <path d="M7 12h5" />
              <path d="M12 12L17 7" />
              <path d="M12 12L17 17" />
              <circle cx="17" cy="7" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="17" cy="17" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <span class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800 tracking-wide font-sans">
              Konnect
            </span>
          </div>
          <p class="mt-2 text-slate-500 font-medium tracking-tight">Precision Management</p>
        </div>

        <!-- Content Card -->
        <div class="bg-white py-10 px-6 shadow-2xl rounded-2xl sm:px-12 border border-slate-100">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class AuthLayoutComponent {}
