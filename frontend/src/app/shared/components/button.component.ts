import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getClasses()"
      class="inline-flex items-center justify-center px-4 h-10 border text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" [class.text-white]="variant !== 'secondary' && variant !== 'ghost'" [class.text-brand-600]="variant === 'secondary' || variant === 'ghost'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  getClasses(): string {
    const base = this.fullWidth ? 'w-full' : '';
    
    const variants: Record<string, string> = {
      primary: 'border-transparent shadow-lg shadow-brand-500/30 text-white bg-brand-600 hover:bg-brand-700 focus:ring-brand-500',
      secondary: 'border-slate-200 shadow-sm text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-200 hover:border-slate-300',
      danger: 'border-transparent shadow-lg shadow-rose-500/30 text-white bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
      ghost: 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-200'
    };

    return `${base} ${variants[this.variant] || variants['primary']}`;
  }
}
