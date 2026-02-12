import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

import { ButtonComponent } from '../../../shared/components/button.component';
import { TableComponent, TableColumn } from '../../../shared/components/table.component';

interface Brand {
  id: string;
  name: string;
}

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, TableComponent],
  template: `
    <div class="space-y-10 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Brands</h1>
          <p class="mt-1 text-sm text-gray-500">Curate your collection of luxury watch brands.</p>
        </div>
        <app-button variant="primary" (click)="openAddModal()" class="shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-shadow">
          <span class="mr-2 text-lg">+</span> Add Brand
        </app-button>
      </div>

      <!-- Table Component -->
      <app-table 
        [data]="displayedBrands" 
        [columns]="columns" 
        [loading]="loading"
        [templates]="{
          id: idTpl,
          actions: actionsTpl
        }"
        [emptyActionTemplate]="emptyActionTpl"
      >
        <!-- Pagination Controls -->
        <div pagination class="flex items-center space-x-2">
          <button 
            [disabled]="currentPage === 1"
            (click)="onPageChange(currentPage - 1)"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed">
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
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </app-table>

      <!-- Templates -->
      <ng-template #idTpl let-brand>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 font-mono">
          {{ brand.id.substring(0, 8) }}...
        </span>
      </ng-template>

      <ng-template #actionsTpl let-brand>
         <button (click)="toggleActionMenu($event, brand.id)" 
                 class="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 relative z-20">
             <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
             </svg>
         </button>
      </ng-template>

      <ng-template #emptyActionTpl>
        <app-button variant="primary" (click)="openAddModal()">
          Create Brand
        </app-button>
      </ng-template>
    </div>

    <!-- Floating Action Menu (Fixed Position) -->
    <div *ngIf="activeActionMenuId && menuPosition" 
         class="fixed z-50 w-40 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 animate-fade-in-up"
         [style.top.px]="menuPosition.top"
         [style.right.px]="menuPosition.right">
        <div class="py-1" role="menu" aria-orientation="vertical">
            <button (click)="handleEdit(); $event.stopPropagation()" class="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors" role="menuitem">
                <svg class="mr-3 h-4 w-4 text-gray-400 group-hover:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
            </button>
            <button (click)="handleDelete(); $event.stopPropagation()" class="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors" role="menuitem">
                <svg class="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
            </button>
        </div>
    </div>

    <!-- Modal Backdrop & Dialog -->
    <div class="fixed inset-0 z-50 overflow-y-auto" *ngIf="isModalOpen">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background Overlay -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" (click)="closeModal()">
           <div class="absolute inset-0 bg-gray-900 opacity-60 backdrop-blur-sm"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- Panel -->
        <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-100">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                  {{ editingBrand ? 'Edit Brand' : 'New Brand' }}
                </h3>
                <div class="mt-2 text-sm text-gray-500">
                  <p class="mb-4">Enter the name of the watch brand.</p>
                  
                  <div *ngIf="errorMessage" class="mb-4 rounded-md bg-red-50 p-3 flex items-start text-left">
                    <svg class="h-5 w-5 text-red-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                       <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
                  </div>

                  <form (ngSubmit)="saveBrand()" class="mt-4">
                    <div class="mb-4 text-left">
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Brand Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="brandName"
                        name="brandName"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm py-2.5 px-3 border"
                        placeholder="e.g. Rolex"
                        required
                        autofocus
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
            <app-button
              type="submit"
              variant="primary"
              [loading]="isSaving"
              [disabled]="!brandName.trim()"
              (click)="saveBrand()"
              class="w-full sm:ml-3 sm:w-auto shadow-md"
            >
              {{ editingBrand ? 'Save Changes' : 'Create Brand' }}
            </app-button>
            <app-button
              variant="secondary"
              (click)="closeModal()"
              class="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
            >
              Cancel
            </app-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Dialog -->
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
                <h3 class="text-lg leading-6 font-bold text-gray-900">Delete Brand</h3>
                <div class="mt-2 text-sm text-gray-500">
                  <p>Are you sure you want to delete <strong class="text-gray-900">{{ brandToDelete?.name }}</strong>?</p>
                   <div *ngIf="deleteError" class="mt-2 rounded-md bg-red-50 p-2">
                    <p class="text-xs font-medium text-red-800">{{ deleteError }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
             <app-button variant="danger" [loading]="isDeleting" (click)="deleteBrand()" class="w-full sm:ml-3 sm:w-auto shadow-md">
              Delete Forever
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
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  loading = true;
  
  isModalOpen = false;
  brandName = '';
  editingBrand: Brand | null = null;
  isSaving = false;
  errorMessage = '';
  
  showDeleteDialog = false;
  brandToDelete: Brand | null = null;
  isDeleting = false;
  deleteError = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  activeActionMenuId: string | null = null;
  menuPosition: { top: number; right: number } | null = null;

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '200px' },
    { key: 'name', label: 'Name' },
    { key: 'actions', label: 'Actions', align: 'right', sticky: true }
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadBrands();
  }

  get displayedBrands(): Brand[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.brands.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

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
      
      this.menuPosition = {
        top: rect.bottom,
        right: window.innerWidth - rect.right
      };
    }
  }

  handleEdit() {
    if (this.activeActionMenuId) {
      const brand = this.brands.find(b => b.id === this.activeActionMenuId);
      if (brand) {
        this.openEditModal(brand);
      }
      this.activeActionMenuId = null;
      this.menuPosition = null;
    }
  }

  handleDelete() {
    if (this.activeActionMenuId) {
      const brand = this.brands.find(b => b.id === this.activeActionMenuId);
      if (brand) {
        this.confirmDelete(brand);
      }
      this.activeActionMenuId = null;
      this.menuPosition = null;
    }
  }

  loadBrands() {
    this.loading = true;
    this.api.get<{success: boolean; data: Brand[]}>('/brands').subscribe({
      next: (res) => {
        if (res.success) {
          this.brands = res.data;
          this.totalItems = res.data.length;
        }
        this.loading = false;
      },
      error: () => {
        console.warn('Failed to load brands');
        this.loading = false;
      }
    });
  }

  openAddModal() {
    this.editingBrand = null;
    this.brandName = '';
    this.errorMessage = '';
    this.isModalOpen = true;
  }

  openEditModal(brand: Brand) {
    this.editingBrand = brand;
    this.brandName = brand.name;
    this.errorMessage = '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.brandName = '';
    this.editingBrand = null;
    this.errorMessage = '';
  }

  saveBrand() {
    if (!this.brandName.trim()) return;
    
    this.isSaving = true;
    this.errorMessage = '';

    const request = this.editingBrand
      ? this.api.put(`/brands/${this.editingBrand.id}`, { name: this.brandName.trim() })
      : this.api.post('/brands', { name: this.brandName.trim() });

    request.subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res.success) {
          this.closeModal();
          this.loadBrands();
        } else {
          this.errorMessage = res.error || 'Failed to save brand';
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.error || 'Failed to save brand';
      }
    });
  }

  confirmDelete(brand: Brand) {
    this.brandToDelete = brand;
    this.deleteError = '';
    this.showDeleteDialog = true;
  }

  deleteBrand() {
    if (!this.brandToDelete) return;
    
    this.isDeleting = true;
    this.deleteError = '';
    
    this.api.delete(`/brands/${this.brandToDelete.id}`).subscribe({
      next: (res: any) => {
        this.isDeleting = false;
        if (res.success) {
          this.showDeleteDialog = false;
          this.brandToDelete = null;
          this.loadBrands();
        } else {
          this.deleteError = res.error || 'Failed to delete brand';
        }
      },
      error: (err) => {
        this.isDeleting = false;
        this.deleteError = err.error?.error || 'Failed to delete brand';
      }
    });
  }
}
