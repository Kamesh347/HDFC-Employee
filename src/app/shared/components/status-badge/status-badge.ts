import { Component, Input } from '@angular/core';

export type StatusBadgeTone = 'neutral' | 'success' | 'pending' | 'danger' | 'income' | 'expense';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadge {
  @Input() label = '';
  @Input() tone: StatusBadgeTone = 'neutral';
}
