import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

export interface SelectOption {
  value: any;
  lable: String;
  disabled?: boolean;
  label : String
}

@Component({
  selector: 'app-select-component',
  imports: [CommonModule],
  templateUrl: './select-component.html',
  styleUrl: './select-component.scss',
})
export class SelectComponent {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() options: SelectOption[] = [];
  @Input() helperText: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  selectedValue: any = '';

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // ControlValueAccessor Interface Implementation
  writeValue(val: any): void {
    this.selectedValue = val ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedValue = val;
    this.onChange(this.selectedValue);
  }

  onBlur(): void {
    this.onTouched();
  }

  get errorMessage(): string | null {
    if (!this.ngControl || !this.ngControl.control) return null;
    const control = this.ngControl.control;

    if (control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return `${this.label || 'Field'} is required.`;
    }
    return null;
  }
}
