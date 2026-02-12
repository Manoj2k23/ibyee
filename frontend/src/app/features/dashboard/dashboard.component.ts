import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade-in">
      
      <!-- Welcome Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p class="mt-2 text-base text-slate-500 max-w-2xl">Welcome back to your command center. Monitor your store's performance at a glance.</p>
        </div>
        <div class="flex items-center gap-3 bg-white pl-3 pr-4 py-2 rounded-full border border-slate-200 shadow-sm ring-1 ring-slate-100">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
            </span>
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-600">System Online</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Products -->
        <div class="bg-white overflow-hidden rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] transition-all duration-300 group hover:-translate-y-1">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Products</p>
                <p class="mt-2 text-3xl font-bold text-slate-900">{{ stats.counts.products }}</p>
              </div>
              <div class="h-12 w-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-sm">
                 <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
              </div>
            </div>
            <!-- Stats removed as per user request -->
          </div>
        </div>

        <!-- Categories -->
        <div class="bg-white overflow-hidden rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] transition-all duration-300 group hover:-translate-y-1">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Categories</p>
                <p class="mt-2 text-3xl font-bold text-slate-900">{{ stats.counts.categories }}</p>
              </div>
              <div class="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
             <!-- Stats removed as per user request -->
          </div>
        </div>

        <!-- Brands -->
        <div class="bg-white overflow-hidden rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] transition-all duration-300 group hover:-translate-y-1">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Brands</p>
                  <p class="mt-2 text-3xl font-bold text-slate-900">{{ stats.counts.brands }}</p>
                </div>
                <div class="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
                   <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>
              </div>
               <!-- Stats removed as per user request -->
            </div>
          </div>

          <!-- Users -->
          <div class="bg-white overflow-hidden rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] transition-all duration-300 group hover:-translate-y-1">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Users</p>
                  <p class="mt-2 text-3xl font-bold text-slate-900">{{ stats.counts.users }}</p>
                </div>
                <div class="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                   <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                   </svg>
                </div>
              </div>
              <div class="mt-4 flex items-center text-xs text-slate-400 font-medium">
                <span class="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mr-2 flex items-center">Active</span>
                now
             </div>
            </div>
          </div>
      </div>

      <!-- Low Stock Alerts (Full Width) -->
        
        <!-- Low Stock Alerts -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
           <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
             <div class="flex items-center space-x-3">
               <div class="bg-red-100 p-2 rounded-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                   <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                 </svg>
               </div>
               <h3 class="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
             </div>
             <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
               {{ stats.lowStockProducts.length }} Alerts
             </span>
           </div>

           <div class="overflow-x-auto">
             <table class="min-w-full divide-y divide-gray-200">
               <thead class="bg-gray-50">
                 <tr>
                   <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                   <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                   <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                   <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                 </tr>
               </thead>
               <tbody class="bg-white divide-y divide-gray-200">
                 <tr *ngFor="let product of stats.lowStockProducts" class="hover:bg-red-50/30 transition-colors">
                   <td class="px-6 py-4 whitespace-nowrap">
                     <div class="flex items-center">
                       <h4 class="text-sm font-medium text-gray-900">{{ product.name }}</h4>
                     </div>
                   </td>
                   <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{{ product.sku }}</td>
                   <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium" [ngClass]="{'text-red-600': product.openingStock <= 5, 'text-yellow-600': product.openingStock > 5}">
                     {{ product.openingStock }}
                   </td>
                   <td class="px-6 py-4 whitespace-nowrap text-right">
                     <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" [ngClass]="product.openingStock <= 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'">
                       {{ product.openingStock <= 5 ? 'Critical' : 'Low Stock' }}
                     </span>
                   </td>
                 </tr>
                 <tr *ngIf="stats.lowStockProducts.length === 0">
                   <td colspan="4" class="px-6 py-12 text-center text-gray-500 text-sm">
                     All stock levels are healthy! 🎉
                   </td>
                 </tr>
               </tbody>
             </table>
           </div>
        </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats = {
    counts: {
      products: 0,
      categories: 0,
      brands: 0,
      users: 0
    },
    lowStockProducts: [] as any[],
    latestProducts: [] as any[]
  };

  constructor(
    private api: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.api.get<{success: boolean, data: any}>('/dashboard/stats').subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
        }
      },
      error: (err) => {
        console.error('Failed to fetch dashboard stats', err);
      }
    });
  }
}
