import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="containerClass">
      <label *ngIf="label" [for]="id" class="block text-sm font-semibold text-slate-700 mb-1.5">
        {{ label }} <span *ngIf="required" class="text-rose-500">*</span>
      </label>
      <div class="relative rounded-lg shadow-sm">
        <div *ngIf="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i [class]="icon + ' text-slate-400'"></i>
        </div>
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [(ngModel)]="value"
          (ngModelChange)="onChange($event)"
          (blur)="onBlur()"
          [ngClass]="getClasses()"
          class="block w-full rounded-lg border-slate-300 py-2.5 px-3 shadow-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 sm:text-sm transition-all duration-200 placeholder:text-slate-400"
        />
      </div>
      <p *ngIf="error" class="mt-1.5 text-xs text-rose-500 font-medium flex items-center">
        <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {{ error }}
      </p>
      <p *ngIf="hint" class="mt-1.5 text-xs text-slate-500">{{ hint }}</p>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() id = `input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() icon = '';
  @Input() containerClass = '';

  value: any = '';

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.value = value;
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
      ${this.icon ? 'pl-10' : ''}
      ${this.error ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:ring-rose-500 focus:border-rose-500' : ''}
      disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
    `;
  }
}
