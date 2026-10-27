import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api-service';
import {
  SelectComponent,
  SelectOption,
} from '../../../../shared/components/select-component/select-component';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FormError } from '../../../../shared/components/form-error/form-error';
import { InputComponent } from '../../../../shared/components/input/input-component';
import { FormActions } from '../../../../shared/components/form-actions/form-actions';

@Component({
  selector: 'app-add-employee',
  imports: [
    ReactiveFormsModule,
    SelectComponent,
    PageHeader,
    FormError,
    InputComponent,
    FormActions,
  ],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.scss',
})
export class AddEmployee {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor(private apiService: ApiService) {}

  isSubmitting = signal<boolean>(false);
  showSuccessBanner = signal<boolean>(true); // Controlled by notification response

  departments = ['IT', 'HR', 'Operations', 'Finance', 'Marketing'];
  departmentOptions: SelectOption[] = this.departments.map((department) => ({
    value: department,
    label: department,
  }));

  // Custom Validator to prevent future dates
  noFutureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today ? { futureDate: true } : null;
  }

  // Reactive Form Setup with strict validations matching the design
  employeeForm = this.fb.group({
    employeeName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    department: ['', [Validators.required]],
    designation: ['', [Validators.required]],
    dateOfJoining: ['', [Validators.required, this.noFutureDateValidator]],
    salary: [0, [Validators.required, Validators.min(0.01)]],
    employeeStatus: ['ACTIVE', [Validators.required]],
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  hasError(fieldName: string, errorName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.hasError(errorName) && (field.touched || field.dirty));
  }

  dismissBanner(): void {
    this.showSuccessBanner.set(false);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    console.log('Employee Payload:', this.employeeForm.value);

    this.apiService.post('employees/createEmployee', this.employeeForm.value).subscribe({
      next: (response) => {
        console.log('Employee created successfully:', response);
        this.employeeForm.reset();
        this.showSuccessBanner.set(true);
      },
    });

    // Simulated REST API call
    // setTimeout(() => {
    //   this.isSubmitting.set(false);
    //   this.showSuccessBanner.set(true);
    // }, 800);
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
