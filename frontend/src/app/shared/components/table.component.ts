
import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sticky?: boolean;
  align?: 'left' | 'center' | 'right';
  format?: (value: any, row: any) => string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[calc(100vh-14rem)]">
      <div class="overflow-auto flex-1">
        <table class="min-w-full w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80 backdrop-blur sticky top-0 z-10 w-full">
            <tr>
              <th *ngFor="let col of columns" 
                  [scope]="'col'"
                  [style.width]="col.width"
                  [style.minWidth]="col.width"
                  [ngClass]="getHeaderClass(col)"
                  class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-50">
            <!-- Data Rows -->
            <tr *ngFor="let row of data; let i = index" class="group hover:bg-slate-50/80 transition-all duration-200">
              <td *ngFor="let col of columns" 
                  [ngClass]="getCellClass(col)"
                  class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                
                <!-- Check for custom template -->
                <ng-container *ngIf="templates && templates[col.key]; else defaultCell">
                  <ng-container *ngTemplateOutlet="templates[col.key]; context: { $implicit: row, index: i }"></ng-container>
                </ng-container>

                <!-- Default Rendering -->
                <ng-template #defaultCell>
                    {{ col.format ? col.format(getValue(row, col.key), row) : getValue(row, col.key) }}
                </ng-template>

              </td>
            </tr>

            <!-- Loading State -->
            <tr *ngIf="loading">
              <td [attr.colspan]="columns.length" class="px-6 py-24 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="relative flex h-10 w-10 mb-4">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-10 w-10 bg-brand-500"></span>
                  </div>
                  <p class="text-sm font-medium text-slate-900">Loading data...</p>
                  <p class="text-xs text-slate-500 mt-1">Please wait while we fetch the latest records.</p>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr *ngIf="!loading && (!data || data.length === 0)">
              <td [attr.colspan]="columns.length" class="px-6 py-24 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                    <svg class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-slate-900">No records found</h3>
                  <p class="text-sm text-slate-500 mt-1 mb-6 max-w-sm">We couldn't find any data matching your criteria.</p>
                  <ng-container *ngIf="emptyActionTemplate">
                    <ng-container *ngTemplateOutlet="emptyActionTemplate"></ng-container>
                  </ng-container>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination (Optional - simplified for now) -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4" *ngIf="!loading && data.length > 0 && showPagination">
        <p class="text-sm text-gray-500 text-center sm:text-left">
           Showing <span class="font-semibold text-gray-900">1</span> to <span class="font-semibold text-gray-900">{{ data.length }}</span> results
        </p>
        <!-- Pagination controls would go here -->
         <ng-content select="[pagination]"></ng-content>
      </div>
    </div>
  `
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading = false;
  @Input() templates: { [key: string]: TemplateRef<any> } = {};
  @Input() emptyActionTemplate: TemplateRef<any> | null = null;
  @Input() showPagination = true;

  getValue(row: any, key: string): any {
    if (!key) return '';
    // Handle nested keys like 'category.name'
    return key.split('.').reduce((obj, k) => (obj || {})[k], row) || (key.includes('.') ? '' : ''); // Return empty string specifically for missing nested props, but keep undefined for top level if we want
  }

  getHeaderClass(col: TableColumn): string {
    const align = col.align === 'right' ? 'text-right' : (col.align === 'center' ? 'text-center' : 'text-left');
    // Header z-20. Sticky Header + Sticky Col intersection needs z-30.
    const sticky = col.sticky ? 'sticky right-0 bg-gray-50 z-30 shadow-l' : 'z-20';
    return `${align} ${sticky}`;
  }

  getCellClass(col: TableColumn): string {
    const align = col.align === 'right' ? 'text-right' : (col.align === 'center' ? 'text-center' : 'text-left');
    // Sticky body cell z-10.
    const sticky = col.sticky ? 'sticky right-0 bg-white group-hover:bg-slate-50 z-10 border-l border-gray-100' : '';
    return `${align} ${sticky}`;
  }
}
