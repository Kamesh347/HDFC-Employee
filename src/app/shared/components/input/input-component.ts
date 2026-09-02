import { CommonModule } from '@angular/common';
import { Component, Input, input, Optional, Self,  } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './input-component.html',
  styleUrl: './input-component.scss',
})
export class InputComponent implements ControlValueAccessor{

  @Input() label: string ='';
  @Input() placeholder: string ='';
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() helperText: string ='';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  value: string ='';


  onChange: (value: any) => void =() =>{};
  onTouched: ()=> void =() => {};

  constructor(@Optional() @Self() public ngControl: NgControl ){
  if(this.ngControl){
  this.ngControl.valueAccessor = this;
  }
}


 writeValue(val: any): void {
    this.value = val || '';
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


  //helper Methods

  onInput(event: Event): void {
    const inputVal = (event.target as HTMLInputElement).value;
    this.value = inputVal;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }


  // Gets error messages automatically based on Reactive Form validation rules
  get errorMessage(): string | null {
    if (!this.ngControl || !this.ngControl.control) return null;

    const control = this.ngControl.control;

    if (control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return `${this.label || 'This field'} is required.`;
      if (control.errors?.['email']) return 'Please enter a valid email address.';
      if (control.errors?.['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} characters required.`;
      }
    }
    return null;
  }






}
