import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.html',
  styleUrl: './search-field.scss',
})
export class SearchField {
  @Input() value = '';
  @Input() placeholder = 'Search';
  @Input() label = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
