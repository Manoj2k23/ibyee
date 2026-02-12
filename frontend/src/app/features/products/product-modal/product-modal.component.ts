import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input.component';
import { SelectComponent, SelectOption } from '../../../shared/components/select.component';
import { ButtonComponent } from '../../../shared/components/button.component';
import { ApiService } from '../../../core/services/api.service';

export interface Product {
  id?: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  status: boolean;
  mrp: number;
  sellingPrice: number;
  gstPercentage: number;
  hsnCode?: string;
  unit: string;
  openingStock: number;
  minStockLevel: number;
  categoryId: string;
  brandId: string;
  // These come from API when fetching products with includes
  category?: { id: string; name: string };
  brand?: { id: string; name: string };
  images?: { id: string; url: string; isPrimary: boolean }[];
}

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, SelectComponent, ButtonComponent],
  template: `
    <!-- Modal Backdrop -->
    <div class="fixed inset-0 z-50 overflow-y-auto" *ngIf="isOpen">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Backdrop overlay -->
        <div class="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" (click)="onClose()"></div>

        <!-- Modal Panel -->
        <div class="inline-block w-full max-w-3xl px-6 pt-6 pb-6 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-2xl sm:my-8 sm:align-middle sm:p-8 border border-slate-100">
          
          <!-- Header -->
          <div class="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <h3 class="text-2xl font-bold text-slate-900 tracking-tight">
                {{ product?.id ? 'Edit Product' : 'Add New Product' }}
              </h3>
              <p class="mt-1 text-sm text-slate-500">Fill in the details below to {{ product?.id ? 'update the' : 'create a' }} product.</p>
            </div>
            <button type="button" (click)="onClose()" class="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="mt-6">
            
            <!-- Error Message -->
            @if (errorMessage) {
              <div class="mb-6 rounded-xl bg-rose-50 p-4 border border-rose-100">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-rose-800">{{ errorMessage }}</p>
                  </div>
                </div>
              </div>
            }

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- Basic Info Section -->
              <div class="sm:col-span-2">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Basic Information</h4>
              </div>
              
              <app-input
                formControlName="name"
                label="Product Name"
                placeholder="Enter product name"
                [required]="true"
                [error]="getError('name')"
              ></app-input>

              <app-input
                formControlName="sku"
                label="SKU"
                placeholder="Enter SKU"
                [required]="true"
                [error]="getError('sku')"
              ></app-input>

              <app-input
                formControlName="barcode"
                label="Barcode"
                placeholder="Enter barcode (optional)"
              ></app-input>

              <app-input
                formControlName="hsnCode"
                label="HSN Code"
                placeholder="Enter HSN code (optional)"
              ></app-input>

              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  formControlName="description"
                  rows="3"
                  class="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:text-sm transition-all duration-200 placeholder:text-slate-400 py-3 px-4"
                  placeholder="Enter product description (optional)"
                ></textarea>
              </div>

              <!-- Category & Brand -->
              <div class="sm:col-span-2 mt-4 pt-4 border-t border-slate-100">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Classification</h4>
              </div>

              <app-select
                formControlName="categoryId"
                label="Category"
                [options]="categoryOptions"
                placeholder="Select category"
                [required]="true"
                [error]="getError('categoryId')"
              ></app-select>

              <app-select
                formControlName="brandId"
                label="Brand"
                [options]="brandOptions"
                placeholder="Select brand"
                [required]="true"
                [error]="getError('brandId')"
              ></app-select>

              <!-- Pricing Section -->
              <div class="sm:col-span-2 mt-4 pt-4 border-t border-slate-100">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Pricing & Tax</h4>
              </div>

              <app-input
                formControlName="mrp"
                label="MRP"
                type="number"
                placeholder="0.00"
                [required]="true"
                [error]="getError('mrp')"
              ></app-input>

              <app-input
                formControlName="sellingPrice"
                label="Selling Price"
                type="number"
                placeholder="0.00"
                [required]="true"
                [error]="getError('sellingPrice')"
              ></app-input>

              <app-input
                formControlName="gstPercentage"
                label="GST Percentage"
                type="number"
                placeholder="0"
                [required]="true"
                [error]="getError('gstPercentage')"
              ></app-input>

              <!-- Stock Section -->
              <div class="sm:col-span-2 mt-4 pt-4 border-t border-slate-100">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Inventory Management</h4>
              </div>

              <app-input
                formControlName="unit"
                label="Unit"
                placeholder="e.g., PCS, KG"
                [required]="true"
                [error]="getError('unit')"
              ></app-input>

              <app-input
                formControlName="openingStock"
                label="Opening Stock"
                type="number"
                placeholder="0"
                [required]="true"
                [error]="getError('openingStock')"
              ></app-input>

              <app-input
                formControlName="minStockLevel"
                label="Low Stock Alert Level"
                type="number"
                placeholder="0"
                [required]="true"
                [error]="getError('minStockLevel')"
              ></app-input>

              <!-- Status -->
              <div class="sm:col-span-2 mt-2">
                 <div class="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div class="flex items-center h-5">
                      <input
                        type="checkbox"
                        formControlName="status"
                        id="status"
                        class="h-5 w-5 text-brand-600 focus:ring-brand-500 border-slate-300 rounded cursor-pointer transition-all duration-200"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="status" class="font-semibold text-slate-900 cursor-pointer">Product is Active</label>
                      <p class="text-slate-500">Inactive products will be hidden from the main catalog.</p>
                    </div>
                 </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-100">
              <app-button variant="secondary" (click)="onClose()">
                Cancel
              </app-button>
              <app-button 
                type="submit" 
                variant="primary" 
                [loading]="isLoading"
                [disabled]="productForm.invalid"
              >
                {{ product?.id ? 'Save Changes' : 'Create Product' }}
              </app-button>
            </div>

          </form>
        </div>
      </div>
    </div>
  `
})
export class ProductModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Product>();

  productForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  
  categoryOptions: SelectOption[] = [];
  brandOptions: SelectOption[] = [];

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required]],
      barcode: [''],
      description: [''],
      status: [true],
      mrp: [0, [Validators.required, Validators.min(0.01)]],
      sellingPrice: [0, [Validators.required, Validators.min(0.01)]],
      gstPercentage: [0, [Validators.required, Validators.min(0)]],
      hsnCode: [''],
      unit: ['PCS', [Validators.required]],
      openingStock: [0, [Validators.required, Validators.min(0)]],
      minStockLevel: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', [Validators.required]],
      brandId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadBrands();
    
    if (this.product) {
      this.productForm.patchValue(this.product);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && !changes['product'].firstChange && this.product) {
      this.productForm.patchValue(this.product);
    }
  }

  loadCategories() {
    this.api.get<{success: boolean; data: {id: string; name: string}[]}>('/categories').subscribe({
      next: (res) => {
        if (res.success) {
          this.categoryOptions = res.data.map(c => ({ value: c.id, label: c.name }));
        }
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  loadBrands() {
    this.api.get<{success: boolean; data: {id: string; name: string}[]}>('/brands').subscribe({
      next: (res) => {
        if (res.success) {
          this.brandOptions = res.data.map(b => ({ value: b.id, label: b.name }));
        }
      },
      error: (err) => {
        console.error('Failed to load brands', err);
      }
    });
  }

  getError(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return `This field is required`;
      if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength}`;
      if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
    }
    return '';
  }

  onSubmit() {
    this.errorMessage = '';
    
    if (this.productForm.valid) {
      this.isLoading = true;
      
      const formValue = this.productForm.value;
      // Convert string numbers to actual numbers
      const productData: Product = {
        ...formValue,
        mrp: parseFloat(formValue.mrp),
        sellingPrice: parseFloat(formValue.sellingPrice),
        gstPercentage: parseFloat(formValue.gstPercentage),
        openingStock: parseInt(formValue.openingStock, 10),
        minStockLevel: parseInt(formValue.minStockLevel, 10)
      };

      const request = this.product?.id 
        ? this.api.put(`/products/${this.product.id}`, productData)
        : this.api.post('/products', productData);

      request.subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.saved.emit(res.data);
            this.onClose();
          } else {
            this.errorMessage = res.message || 'Failed to save product';
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('Save product error', err);
          
          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (err.status === 409) {
            this.errorMessage = 'A product with this SKU already exists.';
          } else if (err.status === 401) {
            this.errorMessage = 'You are not authorized. Please login again.';
          } else {
            this.errorMessage = 'Failed to save product. Please try again.';
          }
        }
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onClose() {
    this.productForm.reset({
      status: true,
      unit: 'PCS',
      mrp: 0,
      sellingPrice: 0,
      gstPercentage: 0,
      openingStock: 0,
      minStockLevel: 0
    });
    this.errorMessage = '';
    this.close.emit();
  }
}
