
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="h-full flex flex-col bg-white text-slate-600 transition-all duration-300 border-r border-slate-200 shadow-xl shadow-slate-200/50"
         [class.w-72]="!isCollapsed()" [class.w-20]="isCollapsed()">
      
      <!-- Logo Area -->
      <div class="h-20 flex items-center px-6 bg-white border-b border-slate-100 justify-between">
        <div class="flex items-center space-x-3 overflow-hidden" [class.opacity-0]="isCollapsed()" [class.w-0]="isCollapsed()">
          <div class="flex-shrink-0 h-10 w-10 bg-brand-50 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/10">
            <svg class="h-6 w-6 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 20V4" />
              <path d="M7 12h5" />
              <path d="M12 12L17 7" />
              <path d="M12 12L17 17" />
              <circle cx="17" cy="7" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="17" cy="17" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div class="flex flex-col whitespace-nowrap transition-opacity duration-200" *ngIf="!isCollapsed()">
            <span class="text-lg font-bold tracking-tight text-slate-800 leading-none">Konnect</span>
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">Enterprise Edition</span>
          </div>
        </div>
        
        <!-- Collapse Toggle -->
        <button (click)="toggleSidebar()" class="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-100">
          <svg *ngIf="!isCollapsed()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          <svg *ngIf="isCollapsed()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto overflow-x-hidden">
        <p *ngIf="!isCollapsed()" class="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 transition-opacity duration-200">Main Menu</p>

        <!-- Dashboard -->
        <a routerLink="/dashboard" 
           routerLinkActive="bg-brand-50 text-brand-700 shadow-sm ring-1 ring-slate-200/50"
           [routerLinkActiveOptions]="{exact: true}"
           class="flex items-center px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 group relative"
           [title]="isCollapsed() ? 'Dashboard' : ''">
          <svg class="h-5 w-5 flex-shrink-0 group-hover:text-brand-600 transition-colors duration-200" 
               [class.text-brand-600]="routerLinkActiveDashboard.isActive"
               fill="none" viewBox="0 0 24 24" stroke="currentColor"
               #routerLinkActiveDashboard="routerLinkActive" routerLinkActive>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span class="ml-3 tracking-wide whitespace-nowrap overflow-hidden transition-all duration-200" [class.w-0]="isCollapsed()" [class.opacity-0]="isCollapsed()">Dashboard</span>
        </a>

        <!-- Products -->
        <a routerLink="/products" 
           routerLinkActive="bg-brand-50 text-brand-700 shadow-sm ring-1 ring-slate-200/50"
           class="flex items-center px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 group relative"
           [title]="isCollapsed() ? 'Products' : ''">
          <svg class="h-5 w-5 flex-shrink-0 group-hover:text-brand-600 transition-colors duration-200"
               [class.text-brand-600]="routerLinkActiveProducts.isActive"
               fill="none" viewBox="0 0 24 24" stroke="currentColor"
               #routerLinkActiveProducts="routerLinkActive" routerLinkActive>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span class="ml-3 tracking-wide whitespace-nowrap overflow-hidden transition-all duration-200" [class.w-0]="isCollapsed()" [class.opacity-0]="isCollapsed()">Products</span>
        </a>

        <!-- Categories -->
        <a routerLink="/categories" 
           routerLinkActive="bg-brand-50 text-brand-700 shadow-sm ring-1 ring-slate-200/50"
           class="flex items-center px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 group relative"
           [title]="isCollapsed() ? 'Categories' : ''">
          <svg class="h-5 w-5 flex-shrink-0 group-hover:text-brand-600 transition-colors duration-200"
               [class.text-brand-600]="routerLinkActiveCategories.isActive"
               fill="none" viewBox="0 0 24 24" stroke="currentColor"
               #routerLinkActiveCategories="routerLinkActive" routerLinkActive>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="ml-3 tracking-wide whitespace-nowrap overflow-hidden transition-all duration-200" [class.w-0]="isCollapsed()" [class.opacity-0]="isCollapsed()">Categories</span>
        </a>

        <!-- Brands -->
        <a routerLink="/brands" 
           routerLinkActive="bg-brand-50 text-brand-700 shadow-sm ring-1 ring-slate-200/50"
           class="flex items-center px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 group relative"
           [title]="isCollapsed() ? 'Brands' : ''">
          <svg class="h-5 w-5 flex-shrink-0 group-hover:text-brand-600 transition-colors duration-200"
               [class.text-brand-600]="routerLinkActiveBrands.isActive"
               fill="none" viewBox="0 0 24 24" stroke="currentColor"
               #routerLinkActiveBrands="routerLinkActive" routerLinkActive>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span class="ml-3 tracking-wide whitespace-nowrap overflow-hidden transition-all duration-200" [class.w-0]="isCollapsed()" [class.opacity-0]="isCollapsed()">Brands</span>
        </a>

        <!-- Users -->
        <a routerLink="/users" 
           routerLinkActive="bg-brand-50 text-brand-700 shadow-sm ring-1 ring-slate-200/50"
           class="flex items-center px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 group relative"
           [title]="isCollapsed() ? 'User Management' : ''">
          <svg class="h-5 w-5 flex-shrink-0 group-hover:text-brand-600 transition-colors duration-200"
               [class.text-brand-600]="routerLinkActiveUsers.isActive"
               fill="none" viewBox="0 0 24 24" stroke="currentColor"
               #routerLinkActiveUsers="routerLinkActive" routerLinkActive>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="ml-3 tracking-wide whitespace-nowrap overflow-hidden transition-all duration-200" [class.w-0]="isCollapsed()" [class.opacity-0]="isCollapsed()">User Management</span>
        </a>
      </nav>

      <!-- User Profile (Bottom) -->
      <div class="p-4 bg-white border-t border-slate-100">
        <div class="flex items-center w-full bg-slate-50 rounded-xl p-3 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer group relative overflow-hidden">
          <div class="flex-shrink-0 relative">
            <div class="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white group-hover:ring-brand-500/20 transition-all">
              {{ getUserInitials() }}
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div class="ml-3 min-w-0 flex-1 overflow-hidden transition-all duration-200" *ngIf="!isCollapsed()">
            <div class="flex items-center justify-between mb-0.5">
               <p class="text-sm font-semibold text-slate-900 truncate group-hover:text-brand-700 transition-colors">
                 {{ currentUser()?.name || 'User' }}
               </p>
            </div>
            <p class="text-[11px] text-slate-500 truncate group-hover:text-slate-600" title="{{ currentUser()?.email }}">
              {{ currentUser()?.email }}
            </p>
          </div>
          
          <button (click)="logout()" class="ml-2 text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-slate-200" title="Logout" *ngIf="!isCollapsed()">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class SidebarComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  isCollapsed = signal(false);

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
  }

  getUserInitials(): string {
    const name = this.currentUser()?.name || this.currentUser()?.email || 'U';
    return name.slice(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout();
  }
}
