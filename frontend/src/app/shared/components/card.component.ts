import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md" [ngClass]="className">
      <div *ngIf="header" class="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex flex-col justify-center">
        <h3 class="text-base font-semibold text-gray-900 tracking-tight">
          {{ header }}
        </h3>
        <p *ngIf="subheader" class="mt-1 text-sm text-gray-500">
          {{ subheader }}
        </p>
      </div>
      <div class="px-6 py-6">
        <ng-content></ng-content>
      </div>
      <div *ngIf="footer" class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-sm text-gray-500">
        {{ footer }}
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() header?: string;
  @Input() subheader?: string;
  @Input() footer?: string;
  @Input() className = '';
}
