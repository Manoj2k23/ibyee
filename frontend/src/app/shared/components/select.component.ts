import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="containerClass">
      <label *ngIf="label" [for]="id" class="block text-sm font-semibold text-slate-700 mb-1.5">
        {{ label }} <span *ngIf="required" class="text-rose-500">*</span>
      </label>
      <div class="relative">
        <select
          [id]="id"
          [disabled]="disabled"
          [(ngModel)]="value"
          (ngModelChange)="onChange($event)"
          (blur)="onBlur()"
          [ngClass]="getClasses()"
          class="block w-full pl-3 pr-10 py-2.5 text-base rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 sm:text-sm shadow-sm transition-all duration-200"
        >
          <option value="" disabled selected>{{ placeholder || 'Select an option' }}</option>
          <option *ngFor="let option of options" [value]="option.value">
            {{ option.label }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
           <!-- Custom arrow if needed, but default is fine with updated styles -->
        </div>
      </div>
      <p *ngIf="error" class="mt-1.5 text-xs text-rose-500 font-medium flex items-center">
        <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {{ error }}
      </p>
    </div>
  `
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() id = `select-${Math.random().toString(36).substr(2, 9)}`;
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() options: SelectOption[] = [];
  @Input() containerClass = '';

  value: string = '';

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur(): void {
    this.onTouch();
  }

  getClasses(): string {
    return `
      ${this.error ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'}
      disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
      ${!this.value ? 'text-slate-500' : 'text-slate-900'}
    `;
  }
}
