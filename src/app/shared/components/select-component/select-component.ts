import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select-component',
  imports: [CommonModule],
  templateUrl: './select-component.html',
  styleUrl: './select-component.scss',
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() options: SelectOption[] = [];
  @Input() helperText: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  selectedValue: string | number = '';
  searchText = '';
  isOpen = false;

  onChange: (value: string | number) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // ControlValueAccessor Interface Implementation
  writeValue(val: any): void {
    this.selectedValue = val ?? '';
    this.searchText = this.selectedOption?.label ?? '';
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) this.isOpen = false;
  }

  get filteredOptions(): SelectOption[] {
    const query = this.searchText.trim().toLocaleLowerCase();
    return query
      ? this.options.filter((option) => option.label.toLocaleLowerCase().includes(query))
      : this.options;
  }

  get selectedOption(): SelectOption | undefined {
    return this.options.find((option) => option.value === this.selectedValue);
  }

  onFocus(): void {
    if (this.disabled) return;
    this.searchText = '';
    this.isOpen = true;
  }

  onSearch(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.isOpen = true;
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    this.selectedValue = option.value;
    this.searchText = option.label;
    this.isOpen = false;
    this.onChange(option.value);
    this.onTouched();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isOpen = false;
      this.searchText = this.selectedOption?.label ?? '';
    } else if (event.key === 'Enter' && this.isOpen && this.filteredOptions.length) {
      event.preventDefault();
      this.selectOption(this.filteredOptions[0]);
    } else if (event.key === 'ArrowDown') {
      this.isOpen = true;
    }
  }

  onFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && (event.currentTarget as HTMLElement).contains(nextTarget)) return;
    this.isOpen = false;
    this.searchText = this.selectedOption?.label ?? '';
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
