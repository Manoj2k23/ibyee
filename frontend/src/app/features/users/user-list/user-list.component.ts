import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ButtonComponent } from '../../../shared/components/button.component';
import { TableComponent, TableColumn } from '../../../shared/components/table.component';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string; // Optional, default to 'Active'
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, TableComponent],
  template: `
    <div class="space-y-10 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p class="mt-1 text-sm text-gray-500">Manage user access, roles, and permissions.</p>
        </div>
        <app-button *ngIf="isAdmin" variant="primary" (click)="openAddModal()" class="shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-shadow">
          <span class="mr-2 text-lg">+</span> Add User
        </app-button>
      </div>

      <!-- Role Filter Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div *ngFor="let role of roles" 
             (click)="selectRole(role.key)"
             [ngClass]="selectedRole === role.key ? 'ring-2 ring-brand-500 bg-brand-50 border-transparent' : 'border-brand-200 hover:border-brand-300'"
             class="relative bg-white rounded-lg border p-5 shadow-sm cursor-pointer transition-all duration-200 group">
             
             <div class="flex items-start justify-between mb-3">
               <div>
                 <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ role.label }}S</p>
                 <p class="mt-1 text-2xl font-semibold text-gray-900">{{ getUserCount(role.key) }}</p>
               </div>
               
               <!-- Active Checkmark -->
               <div *ngIf="selectedRole === role.key" class="h-6 w-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                   <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                 </svg>
               </div>
             </div>

             <p class="text-sm text-gray-500 leading-relaxed">{{ role.description }}</p>
        </div>
      </div>

      <!-- Filter Hint Caption -->
      <div class="text-center -mt-8 mb-8">
        <p class="text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          Click on a role card to filter users by that role
        </p>
      </div>

      <!-- Active Filter Indicator & Clear Option -->
      <div class="flex items-center justify-between mb-4" *ngIf="selectedRole">
          <p class="text-sm text-gray-500">
             Showing only <span class="font-bold text-gray-900">{{ getRoleLabel(selectedRole) }}s</span>
          </p>
          <button (click)="clearFilter()" 
                class="text-sm text-red-600 hover:text-red-800 font-medium hover:underline transition-colors focus:outline-none">
          Clear Filter
        </button>
      </div>

      <!-- Table Component -->
      <app-table 
        [data]="displayedUsers" 
        [columns]="columns" 
        [loading]="loading"
        [templates]="{
          user: userTpl,
          role: roleTpl,
          status: statusTpl,
          actions: actionsTpl
        }"
        [emptyActionTemplate]="emptyActionTpl"
      >
        <!-- Pagination Controls -->
        <div pagination class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-500 text-center sm:text-left">
             Showing <span class="font-semibold text-gray-900">{{ totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0 }}</span> to <span class="font-semibold text-gray-900">{{ Math.min(currentPage * pageSize, totalItems) }}</span> of <span class="font-semibold text-gray-900">{{ totalItems }}</span> users
          </p>
          <div class="flex items-center space-x-2">
            <button 
              [disabled]="currentPage === 1"
              (click)="onPageChange(currentPage - 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Page {{ currentPage }} of {{ totalPages || 1 }}
            </span>
            <button 
              [disabled]="currentPage === totalPages" 
              (click)="onPageChange(currentPage + 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </app-table>

      <!-- Templates -->
      <ng-template #userTpl let-user>
        <div class="flex items-center">
            <div class="h-9 w-9 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 border border-brand-100 shadow-sm">
                {{ user.name ? user.name.slice(0,2).toUpperCase() : user.email.slice(0,2).toUpperCase() }}
            </div>
            <div class="ml-4">
                <div class="text-sm font-semibold text-gray-900">{{ user.name || 'Unknown' }}</div>
                <div class="text-xs text-gray-500">{{ user.email }}</div>
            </div>
        </div>
      </ng-template>

      <ng-template #roleTpl let-user>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              [ngClass]="getRoleClass(user.role)">
          {{ user.role }}
        </span>
      </ng-template>

      <ng-template #statusTpl let-user>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              [ngClass]="(user.status === 'ACTIVE' || !user.status) 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-red-100 text-red-800 border-red-200'">
           <span class="h-1.5 w-1.5 rounded-full mr-1.5" 
                 [ngClass]="(user.status === 'ACTIVE' || !user.status) ? 'bg-green-500' : 'bg-red-500'"></span>
           {{ (user.status === 'ACTIVE' || !user.status) ? 'Active' : 'Inactive' }}
        </span>
      </ng-template>

      <ng-template #actionsTpl let-user>
         <button (click)="toggleActionMenu($event, user.id)" 
                 [disabled]="!isAdmin"
                 class="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 relative z-20 disabled:opacity-50">
             <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
             </svg>
         </button>
      </ng-template>

      <ng-template #emptyActionTpl>
        <app-button *ngIf="isAdmin" variant="primary" (click)="openAddModal()">
          Create New User
        </app-button>
      </ng-template>
    </div>

    <!-- Floating Action Menu -->
    <div *ngIf="activeActionMenuId && menuPosition" 
         class="fixed z-50 w-48 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 animate-fade-in-up"
         [style.top.px]="menuPosition.top"
         [style.right.px]="menuPosition.right">
        <div class="py-1" role="menu" aria-orientation="vertical">
            <button (click)="handleEdit(); $event.stopPropagation()" class="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors" role="menuitem">
                <svg class="mr-3 h-4 w-4 text-gray-400 group-hover:text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Details
            </button>
            <button (click)="handleChangeRole(); $event.stopPropagation()" class="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors" role="menuitem">
                <svg class="mr-3 h-4 w-4 text-gray-400 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Change Role
            </button>
            <button (click)="handleStatusToggle(); $event.stopPropagation()" class="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" [ngClass]="isUserActive(activeActionMenuId) ? 'hover:text-red-600' : 'hover:text-green-600'" role="menuitem">
                <svg class="mr-3 h-4 w-4 text-gray-400 group-hover:text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" *ngIf="isUserActive(activeActionMenuId)" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" *ngIf="!isUserActive(activeActionMenuId)" />
                </svg>
                {{ isUserActive(activeActionMenuId) ? 'Deactivate User' : 'Activate User' }}
            </button>
            <button (click)="handleDelete(); $event.stopPropagation()" class="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors" role="menuitem">
                <svg class="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete User
            </button>
        </div>
    </div>

    <!-- Status Change Dialog -->
    <div class="fixed inset-0 z-50 overflow-y-auto" *ngIf="showStatusDialog">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" (click)="showStatusDialog = false">
          <div class="absolute inset-0 bg-gray-900 opacity-60 backdrop-blur-sm"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full border border-gray-100">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10" [ngClass]="targetStatus === 'ACTIVE' ? 'bg-green-100' : 'bg-red-100'">
                <svg *ngIf="targetStatus === 'ACTIVE'" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg *ngIf="targetStatus === 'INACTIVE'" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-bold text-gray-900">
                    {{ targetStatus === 'ACTIVE' ? 'Activate User' : 'Deactivate User' }}
                </h3>
                <div class="mt-2 text-sm text-gray-500">
                  <p>Are you sure you want to <strong>{{ targetStatus === 'ACTIVE' ? 'activate' : 'deactivate' }}</strong> user <strong class="text-gray-900">{{ statusUser?.name }}</strong>?</p>
                  <p *ngIf="targetStatus === 'INACTIVE'" class="mt-2 text-xs text-red-500">The user will no longer be able to log in.</p>
                  <div *ngIf="statusError" class="mt-2 rounded-md bg-red-50 p-2">
                    <p class="text-xs font-medium text-red-800">{{ statusError }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
             <app-button [variant]="targetStatus === 'ACTIVE' ? 'primary' : 'danger'" [loading]="isStatusChanging" (click)="confirmStatusChange()" class="w-full sm:ml-3 sm:w-auto shadow-md">
              {{ targetStatus === 'ACTIVE' ? 'Activate' : 'Deactivate' }}
            </app-button>
            <app-button variant="secondary" (click)="showStatusDialog = false; statusError = ''" class="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
              Cancel
            </app-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Role Modal -->
    <div class="fixed inset-0 z-50 overflow-y-auto" *ngIf="isRoleModalOpen">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" (click)="isRoleModalOpen = false">
          <div class="absolute inset-0 bg-gray-900 opacity-60 backdrop-blur-sm"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm w-full border border-gray-100">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-bold text-gray-900 mb-4">Change User Role</h3>
            <p class="text-sm text-gray-500 mb-4">
                Select a new role for <strong class="text-gray-900">{{ roleUser?.name }}</strong>.
            </p>
            
            <div *ngIf="roleError" class="mb-4 rounded-md bg-red-50 p-3">
                 <p class="text-sm font-medium text-red-800">{{ roleError }}</p>
            </div>

            <div class="space-y-3">
                <div *ngFor="let role of roles" 
                     (click)="selectedNewRole = role.key"
                     [ngClass]="selectedNewRole === role.key ? 'ring-2 ring-brand-500 bg-brand-50 border-brand-200' : 'border border-gray-200 hover:bg-gray-50'"
                     class="flex items-center p-3 rounded-lg cursor-pointer transition-all">
                    <!-- Icon removed -->
                    <div>
                        <p class="text-sm font-medium text-gray-900">{{ role.label }}</p>
                    </div>
                    <div class="ml-auto" *ngIf="selectedNewRole === role.key">
                        <svg class="h-5 w-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
             <app-button variant="primary" [loading]="isRoleChanging" (click)="saveRoleChange()" [disabled]="!selectedNewRole || selectedNewRole === roleUser?.role" class="w-full sm:ml-3 sm:w-auto shadow-md">
              Update Role
            </app-button>
            <app-button variant="secondary" (click)="isRoleModalOpen = false; roleError = ''" class="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
              Cancel
            </app-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div class="fixed inset-0 z-50 overflow-y-auto" *ngIf="isModalOpen">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" (click)="closeModal()">
          <div class="absolute inset-0 bg-gray-900 opacity-60 backdrop-blur-sm"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-100">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-brand-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                  {{ editingUser ? 'Edit User' : 'New User' }}
                </h3>
                <div class="mt-2 text-sm text-gray-500">
                  <p class="mb-4">Enter user details and assign a role.</p>
                  
                  <div *ngIf="errorMessage" class="mb-4 rounded-md bg-red-50 p-3 flex items-start text-left">
                    <svg class="h-5 w-5 text-red-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                       <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
                  </div>

                  <form (ngSubmit)="saveUser()" class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" [(ngModel)]="formData.name" name="name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2 px-3 border" required>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input type="email" [(ngModel)]="formData.email" name="email" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2 px-3 border" required>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select [(ngModel)]="formData.role" name="role" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2 px-3 border">
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>

                    <div *ngIf="!editingUser">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" [(ngModel)]="formData.password" name="password" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2 px-3 border" required minlength="6">
                        <p class="text-xs text-gray-400 mt-1">Must be at least 6 characters.</p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
            <app-button type="submit" variant="primary" [loading]="isSaving" (click)="saveUser()" class="w-full sm:ml-3 sm:w-auto shadow-md">
              {{ editingUser ? 'Save Changes' : 'Create User' }}
            </app-button>
            <app-button variant="secondary" (click)="closeModal()" class="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
              Cancel
            </app-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div class="fixed inset-0 z-50 overflow-y-auto" *ngIf="showDeleteDialog">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" (click)="showDeleteDialog = false">
          <div class="absolute inset-0 bg-gray-900 opacity-60 backdrop-blur-sm"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full border border-gray-100">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-bold text-gray-900">Delete User</h3>
                <div class="mt-2 text-sm text-gray-500">
                  <p>Are you sure you want to delete <strong class="text-gray-900">{{ userToDelete?.name || userToDelete?.email }}</strong>?</p>
                   <div *ngIf="deleteError" class="mt-2 rounded-md bg-red-50 p-2">
                    <p class="text-xs font-medium text-red-800">{{ deleteError }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
             <app-button variant="danger" [loading]="isDeleting" (click)="deleteUser()" class="w-full sm:ml-3 sm:w-auto shadow-md">
              Delete User
            </app-button>
            <app-button variant="secondary" (click)="showDeleteDialog = false; deleteError = ''" class="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto">
              Cancel
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  isAdmin = false;
  Math = Math; // for template

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Filter
  selectedRole: string | null = null; // null means 'ALL' basically (but we can say 'ALL' expicitly)

  roles = [
    { 
      key: 'ADMIN', 
      label: 'Admin', 
      description: 'Full access to all system features. Can manage users, roles, and all product settings.'
    },
    { 
      key: 'MANAGER', 
      label: 'Manager', 
      description: 'Can manage products and inventory. Restricted from changing user roles or system settings.'
    }
  ];

  // Modals
  isModalOpen = false;
  editingUser: User | null = null;
  formData = { name: '', email: '', role: 'MANAGER', password: '' };
  isSaving = false;
  errorMessage = '';

  showDeleteDialog = false;
  userToDelete: User | null = null;
  isDeleting = false;
  deleteError = '';

  // Status Modal
  showStatusDialog = false;
  statusUser: User | null = null;
  targetStatus: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';
  isStatusChanging = false;
  statusError = '';

  // Role Modal
  isRoleModalOpen = false;
  roleUser: User | null = null;
  selectedNewRole: string = '';
  isRoleChanging = false;
  roleError = '';

  // Floating Menu
  activeActionMenuId: string | null = null;
  menuPosition: { top: number; right: number } | null = null;

  columns: TableColumn[] = [
    { key: 'user', label: 'User', width: '30%' },
    { key: 'role', label: 'Role', width: '20%' },
    { key: 'status', label: 'Status', width: '20%' },
    { key: 'actions', label: 'Actions', align: 'right', sticky: true }
  ];

  constructor(private api: ApiService, private auth: AuthService) {
    this.isAdmin = this.auth.hasRole('ADMIN');
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.api.get<{success: boolean; data: User[]}>('/users').subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
          this.filterUsers();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.loading = false;
      }
    });
  }

  selectRole(roleKey: string) {
    if (this.selectedRole === roleKey) {
      this.selectedRole = null; // Toggle off
    } else {
      this.selectedRole = roleKey;
    }
    this.currentPage = 1; // Reset to first page on filter change
    this.filterUsers();
  }

  clearFilter() {
    this.selectedRole = null;
    this.currentPage = 1;
    this.filterUsers();
  }

  getRoleLabel(roleKey: string): string {
    return this.roles.find(r => r.key === roleKey)?.label || roleKey;
  }

  filterUsers() {
    if (this.selectedRole) {
      this.filteredUsers = this.users.filter(u => u.role === this.selectedRole);
    } else {
      this.filteredUsers = [...this.users];
    }
    this.totalItems = this.filteredUsers.length;
  }

  getUserCount(roleKey: string): number {
    return this.users.filter(u => u.role === roleKey).length;
  }

  get displayedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  // --- Modal Logic ---

  openAddModal() {
    this.editingUser = null;
    this.formData = { name: '', email: '', role: 'MANAGER', password: '' };
    this.errorMessage = '';
    this.isModalOpen = true;
  }

  openEditModal(user: User) {
    this.editingUser = user;
    this.formData = { 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      password: '' // Password usually not editable directly here or optional
    };
    this.errorMessage = '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingUser = null;
    this.errorMessage = '';
  }

  saveUser() {
    this.isSaving = true;
    this.errorMessage = '';

    const payload = { ...this.formData };
    if (this.editingUser) {
      delete (payload as any).password; // Don't send empty password on edit
    }

    const request = this.editingUser
      ? this.api.put(`/users/${this.editingUser.id}`, payload)
      : this.api.post('/auth/register', payload); // Assuming create user maps to register or similar

    request.subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res.success || res.token) { // Register returns token usually, update returns success
          this.closeModal();
          this.loadUsers();
        } else {
          this.errorMessage = res.error || 'Operation failed';
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.error || 'Operation failed';
      }
    });
  }

  // --- Role Change Logic ---
  handleChangeRole() {
    if (this.activeActionMenuId) {
      const user = this.users.find(u => u.id === this.activeActionMenuId);
      if (user) {
        this.roleUser = user;
        this.selectedNewRole = user.role;
        this.roleError = '';
        this.isRoleModalOpen = true;
      }
      this.activeActionMenuId = null;
      this.menuPosition = null;
    }
  }

  saveRoleChange() {
    if (!this.roleUser || !this.selectedNewRole) return;

    this.isRoleChanging = true;
    this.api.patch(`/users/${this.roleUser.id}/role`, { role: this.selectedNewRole }).subscribe({
      next: (res: any) => {
        this.isRoleChanging = false;
        if (res.success) {
          this.isRoleModalOpen = false;
          // Optimistic Update or Reload
          this.loadUsers();
        } else {
          this.roleError = res.error || 'Failed to update user role';
        }
      },
      error: (err) => {
        this.isRoleChanging = false;
        this.roleError = err.error?.error || 'Failed to update user role';
      }
    });
  }

  // --- Status Change Logic ---
  isUserActive(userId: string | null): boolean {
    if (!userId) return false;
    const user = this.users.find(u => u.id === userId);
    return !user?.status || user.status === 'ACTIVE'; // Default to active if undefined
  }

  handleStatusToggle() {
    if (this.activeActionMenuId) {
      const user = this.users.find(u => u.id === this.activeActionMenuId);
      if (user) {
        this.statusUser = user;
        const currentStatus = user.status || 'ACTIVE';
        this.targetStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        this.statusError = '';
        this.showStatusDialog = true;
      }
      this.activeActionMenuId = null;
      this.menuPosition = null;
    }
  }

  confirmStatusChange() {
    if (!this.statusUser) return;

    this.isStatusChanging = true;
    this.api.patch(`/users/${this.statusUser.id}/status`, { status: this.targetStatus }).subscribe({
      next: (res: any) => {
        this.isStatusChanging = false;
        if (res.success) {
          this.showStatusDialog = false;
          this.loadUsers();
        } else {
          this.statusError = res.error || 'Failed to update status';
        }
      },
      error: (err) => {
        this.isStatusChanging = false;
        this.statusError = err.error?.error || 'Failed to update status';
      }
    });
  }

  // --- Delete Logic ---

  confirmDelete(user: User) {
    this.userToDelete = user;
    this.deleteError = '';
    this.showDeleteDialog = true;
  }

  deleteUser() {
    if (!this.userToDelete) return;

    this.isDeleting = true;
    this.api.delete(`/users/${this.userToDelete.id}`).subscribe({
      next: (res: any) => {
        this.isDeleting = false;
        if (res.success) {
          this.showDeleteDialog = false;
          this.userToDelete = null;
          this.loadUsers();
        } else {
          this.deleteError = res.error || 'Failed to delete user';
        }
      },
      error: (err) => {
        this.isDeleting = false;
        this.deleteError = err.error?.error || 'Failed to delete user';
      }
    });
  }

  // --- Floating Menu Logic ---

  @HostListener('document:click')
  onDocumentClick() {
    if (this.activeActionMenuId !== null) {
      this.activeActionMenuId = null;
      this.menuPosition = null;
    }
  }

  toggleActionMenu(event: any, id: string) {
    event.stopPropagation();
    if (this.activeActionMenuId === id) {
      this.activeActionMenuId = null;
      this.menuPosition = null;
    } else {
      this.activeActionMenuId = id;
      const button = (event.currentTarget as HTMLElement);
      const rect = button.getBoundingClientRect();
      const menuHeight = 200; // Estimated height
      const spaceBelow = window.innerHeight - rect.bottom;
      
      const top = spaceBelow < menuHeight ? rect.top - menuHeight : rect.bottom;

      this.menuPosition = {
        top: top,
        right: window.innerWidth - rect.right
      };
    }
  }

  handleEdit() {
    if (this.activeActionMenuId) {
      const user = this.users.find(u => u.id === this.activeActionMenuId);
      if (user) this.openEditModal(user);
      this.activeActionMenuId = null;
      this.menuPosition = null;
    }
  }

  handleDelete() {
    if (this.activeActionMenuId) {
      const user = this.users.find(u => u.id === this.activeActionMenuId);
      if (user) this.confirmDelete(user);
      this.activeActionMenuId = null;
      this.menuPosition = null;
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'MANAGER': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}
