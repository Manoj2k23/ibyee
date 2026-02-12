import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ButtonComponent } from '../../../shared/components/button.component';
import { ProductModalComponent, Product } from '../product-modal/product-modal.component';
import { TableComponent, TableColumn } from '../../../shared/components/table.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ProductModalComponent, TableComponent],
  template: `
    <div class="space-y-10 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p class="mt-2 text-base text-slate-500 max-w-2xl">Manage your product inventory, pricing, and stock levels efficiently.</p>
        </div>
        <app-button variant="primary" (click)="openAddModal()" class="shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 transition-shadow">
          <span class="mr-2 text-lg leading-none">+</span> Add Product
        </app-button>
      </div>

      <!-- Table Component -->
      <app-table 
        [data]="displayedProducts" 
        [columns]="columns" 
        [loading]="loading"
        [templates]="{
          name: nameTpl,
          description: descTpl,
          sku: skuTpl,
          sellingPrice: priceTpl,
          openingStock: stockTpl,
          status: statusTpl,
          actions: actionsTpl
        }"
        [emptyActionTemplate]="emptyActionTpl"
      >
        <!-- Pagination Controls -->
        <div pagination class="flex items-center space-x-2 bg-white px-4 py-3 border-t border-slate-100 sm:px-6">
          <button 
            [disabled]="currentPage === 1"
            (click)="onPageChange(currentPage - 1)"
            class="relative inline-flex items-center px-2 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <span class="relative inline-flex items-center px-4 py-2 border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 rounded-lg">
            Page {{ currentPage }} of {{ totalPages || 1 }}
          </span>

          <button 
            [disabled]="currentPage === totalPages" 
            (click)="onPageChange(currentPage + 1)"
             class="relative inline-flex items-center px-2 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </app-table>

      <!-- Templates -->
      <ng-template #nameTpl let-product>
        <span class="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{{ product.name }}</span>
      </ng-template>

      <ng-template #descTpl let-product>
        <div class="max-w-md overflow-hidden text-ellipsis whitespace-nowrap">
           <span class="text-xs text-slate-500" *ngIf="product.description" title="{{ product.description }}">
              {{ product.description | slice:0:60 }}{{ product.description.length > 60 ? '...' : '' }}
           </span>
           <span class="text-xs text-slate-300" *ngIf="!product.description">-</span>
        </div>
      </ng-template>

      <ng-template #skuTpl let-product>
         <span class="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200 select-all shadow-sm">{{ product.sku }}</span>
      </ng-template>

      <ng-template #priceTpl let-product>
         <div class="flex flex-col">
            <span class="text-sm font-bold text-slate-900">₹{{ product.sellingPrice }}</span>
            <span class="text-xs text-slate-400 line-through" *ngIf="product.mrp > product.sellingPrice">₹{{ product.mrp }}</span>
         </div>
      </ng-template>

      <ng-template #statusTpl let-product>
        <span class="px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full border shadow-sm"
            [ngClass]="product.status 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-rose-50 text-rose-700 border-rose-100'">
            <span class="w-1.5 h-1.5 rounded-full mr-1.5 self-center" [ngClass]="product.status ? 'bg-emerald-500' : 'bg-rose-500'"></span>
            {{ product.status ? 'Active' : 'Inactive' }}
        </span>
      </ng-template>

      <ng-template #stockTpl let-product>
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium" 
                [ngClass]="{
                  'text-red-600': product.openingStock <= 5,
                  'text-yellow-600': product.openingStock > 5 && product.openingStock <= product.minStockLevel,
                  'text-gray-900': product.openingStock > product.minStockLevel
                }">
            {{ product.openingStock }}
          </span>
          <span *ngIf="product.openingStock <= product.minStockLevel" 
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Low
          </span>
        </div>
      </ng-template>

      <ng-template #actionsTpl let-product>
         <button (click)="toggleActionMenu($event, product.id)" 
                 class="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 relative z-20">
             <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
             </svg>
         </button>
      </ng-template>

      <ng-template #emptyActionTpl>
        <app-button variant="primary" (click)="openAddModal()">
          Add Product
        </app-button>
      </ng-template>

    </div>

    <!-- Floating Action Menu (Fixed Position) -->
    <div *ngIf="activeActionMenuId && menuPosition" 
         class="fixed z-50 w-40 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 animate-fade-in-up"
         [style.top.px]="menuPosition.top"
         [style.right.px]="menuPosition.right">
        <div class="py-1" role="menu" aria-orientation="vertical">
            <button (click)="handleEdit(); $event.stopPropagation()" class="w-full text-left flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors group" role="menuitem">
                <svg class="mr-3 h-4 w-4 text-slate-400 group-hover:text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

    <!-- Product Modal -->
    <app-product-modal
        [isOpen]="isModalOpen"
        [product]="selectedProduct"
        (close)="closeModal()"
        (saved)="onProductSaved($event)"
    ></app-product-modal>

    <!-- Delete Confirmation Dialog -->
    <div class="fixed inset-0 z-50 overflow-y-auto" *ngIf="showDeleteDialog" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" (click)="showDeleteDialog = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Delete Product</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete <span class="font-bold text-gray-900">"{{ productToDelete?.name }}"</span>? This action cannot be undone and will remove the product from your inventory permanently.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <app-button variant="danger" [loading]="isDeleting" (click)="deleteProduct()" class="w-full sm:w-auto sm:ml-3">
              Delete Product
            </app-button>
            <app-button variant="secondary" (click)="showDeleteDialog = false" class="w-full sm:w-auto mt-3 sm:mt-0">
              Cancel
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = []; // for search/filter in future
  loading = true;
  isModalOpen = false;
  selectedProduct: Product | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  showDeleteDialog = false;
  productToDelete: Product | null = null;
  isDeleting = false;

  activeActionMenuId: string | null = null;
  menuPosition: { top: number; right: number } | null = null;

  columns: TableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description', width: '350px' },
    { key: 'sku', label: 'SKU' },
    { key: 'barcode', label: 'Barcode', format: (v: any) => v || '-' },
    { key: 'hsnCode', label: 'HSN Code', format: (v: any) => v || '-' },
    { key: 'category.name', label: 'Category', format: (v: any) => v || 'N/A' },
    { key: 'brand.name', label: 'Brand', format: (v: any) => v || 'N/A' },
    { key: 'mrp', label: 'MRP', format: (v: any) => `₹${v}` },
    { key: 'sellingPrice', label: 'Selling Price' },
    { key: 'gstPercentage', label: 'GST %', format: (v: any) => `${v}%` },
    { key: 'unit', label: 'Unit' },
    { key: 'openingStock', label: 'Opening Stock' },
    { key: 'minStockLevel', label: 'Min Stock' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', align: 'right', sticky: true }
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadProducts();
  }

  get displayedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.products.slice(startIndex, startIndex + this.pageSize);
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

  toggleActionMenu(event: any, productId: string) {
    event.stopPropagation();
    
    if (this.activeActionMenuId === productId) {
      this.activeActionMenuId = null;
      this.menuPosition = null;
    } else {
      this.activeActionMenuId = productId;
      
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
      const product = this.products.find(p => p.id === this.activeActionMenuId);
      if (product) {
        this.openEditModal(product);
      }
      this.activeActionMenuId = null;
      this.menuPosition = null;
    }
  }

  handleDelete() {
    if (this.activeActionMenuId) {
      const product = this.products.find(p => p.id === this.activeActionMenuId);
      if (product) {
        this.confirmDelete(product);
      }
      this.activeActionMenuId = null;
      this.menuPosition = null;
    }
  }

  loadProducts() {
    this.loading = true;
    this.api.get<Product[]>('/products').subscribe({
      next: (data) => {
        this.products = data;
        this.totalItems = data.length;
        this.loading = false;
      },
      error: () => {
        console.warn('API/Products failed - likely backend not running or cors issue. Using empty state.');
        this.loading = false;
      }
    });
  }

  getPrimaryImage(product: any): string {
    const primary = product.images?.find((i: any) => i.isPrimary);
    return primary ? primary.url : 'https://placehold.co/40x40?text=No+Img';
  }

  openAddModal() {
    this.selectedProduct = null;
    this.isModalOpen = true;
  }

  openEditModal(product: Product) {
    this.selectedProduct = { ...product };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  onProductSaved(product: Product) {
    // Reload the product list to get fresh data
    this.loadProducts();
  }

  confirmDelete(product: Product) {
    this.productToDelete = product;
    this.showDeleteDialog = true;
  }

  deleteProduct() {
    if (!this.productToDelete?.id) return;
    
    this.isDeleting = true;
    this.api.delete(`/products/${this.productToDelete.id}`).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteDialog = false;
        this.productToDelete = null;
        this.loadProducts();
      },
      error: (err) => {
        this.isDeleting = false;
        console.error('Delete failed', err);
        alert(err.error?.message || 'Failed to delete product');
      }
    });
  }
}
