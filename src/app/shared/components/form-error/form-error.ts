import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.html',
  styleUrl: './form-error.scss',
})
export class FormError {
  @Input() message = '';
}
