import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api-service';

@Component({
  selector: 'app-add-income',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-income.html',
  styleUrl: './add-income.scss',
})
export class AddIncome {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private apiService = inject(ApiService);

  isSubmitting = signal<boolean>(false);

  // Sample employee dropdown list
  employees = signal([
    { id: 'emp001', name: 'Kameshwar Roy' },
    { id: 'emp002', name: 'Anish Sharma' },
    { id: 'emp003', name: 'Priya Verma' },
  ]);

  incomeCategories = ['Salary', 'Bonus', 'Incentive', 'Investment', 'Freelance', 'Other'];
  paymentMethods = ['Bank Transfer', 'Cash', 'UPI', 'Other'];

  // Form Setup with Validations
  incomeForm = this.fb.group({
    employeeId: ['', [Validators.required]],
    incomeSource: ['', [Validators.required]],
    category: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    incomeDate: ['', [Validators.required]],
    paymentMethod: ['', [Validators.required]],
    description: [''],
  });

  // Helper method for error checking
  isFieldInvalid(fieldName: string): boolean {
    const field = this.incomeForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  onSubmit(): void {
    if (this.incomeForm.invalid) {
      this.incomeForm.markAllAsTouched();

      return;
    }

    this.isSubmitting.set(true);
    console.log('Form Payload:', this.incomeForm.value);

    this.apiService.post('/income/createIncome', this.incomeForm.value).subscribe({
      next: (response) => {
        console.log('Income added successfully:', response);
      },
      error: (error) => {
        console.error('Error adding income:', error);
      },
    });

    // Simulate API Call
    // setTimeout(() => {
    //   this.isSubmitting.set(false);
    //   this.router.navigate(['/dashboard']);
    // }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  selectedEmpId() {}


  searchEmpNameId(){
    
  }
}
