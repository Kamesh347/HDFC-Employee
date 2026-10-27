import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-actions',
  templateUrl: './form-actions.html',
  styleUrl: './form-actions.scss',
})
export class FormActions {
  @Input() submitLabel = 'Save';
  @Input() cancelLabel = 'Cancel';
  @Input() busyLabel = 'Saving...';
  @Input() busy = false;
  @Input() disabled = false;
  @Output() cancelled = new EventEmitter<void>();
}
