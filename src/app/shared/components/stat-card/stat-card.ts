import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCard {
  @Input() label = '';
  @Input() value: string | number | null = '';
  @Input() tone: 'neutral' | 'positive' | 'negative' | 'accent' = 'neutral';
  @Input() variant: 'dashboard' | 'summary' = 'dashboard';
}
