import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../shared/components/input/input-component';
import {
  SelectComponent,
  SelectOption,
} from '../../../../shared/components/select-component/select-component';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-add-expense',
  imports: [ReactiveFormsModule, InputComponent, SelectComponent, PageHeader],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.scss',
})
export class AddExpense {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isSubmitting = signal<boolean>(false);

  // Sample employee dropdown list
  employees = signal([
    { id: 'emp001', name: 'Kameshwar Roy' },
    { id: 'emp002', name: 'Anish Sharma' },
    { id: 'emp003', name: 'Priya Verma' },
  ]);

  expenseCategories = [
    'Rent',
    'Food & Groceries',
    'Transportation',
    'Shopping',
    'Utilities',
    'Medical',
    'Other',
  ];
  expenseCategoryOptions: SelectOption[] = this.expenseCategories.map((category) => ({
    value: category,
    label: category,
  }));
  paymentMethods = ['Corporate Credit Card', 'Bank Transfer', 'Petty Cash', 'UPI', 'Reimbursement'];

  // Form Setup with Validations
  expenseForm = this.fb.group({
    selectedCategory: [],
    employeeId: ['', [Validators.required]],
    vendorName: ['', [Validators.required]],
    category: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    expenseDate: ['', [Validators.required]],
    paymentMethod: ['', [Validators.required]],
    description: [''],
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.expenseForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    console.log('Expense Payload:', this.expenseForm.value);

    // Simulate REST API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}

//  <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="expense-form">

//       <!-- Employee Field -->
//       <div class="form-group">
//         <label>Employee <span class="required">*</span></label>
//         <select formControlName="employeeId" class="form-control" [class.is-invalid]="isFieldInvalid('employeeId')">
//           <option value="" disabled selected>Select Employee...</option>
//           @for (emp of employees(); track emp.id) {
//             <option [value]="emp.id">{{ emp.name }} ({{ emp.id }})</option>
//           }
//         </select>
//         @if (isFieldInvalid('employeeId')) {
//           <span class="error-msg">Employee is required.</span>
//         }
//       </div>

//       <!-- Merchant / Vendor Name -->
//       <div class="form-group">
//         <label>Vendor / Expense Source <span class="required">*</span></label>
//         <input
//           type="text"
//           formControlName="vendorName"
//           placeholder="e.g., Landlord, Supermarket, Utility Provider"
//           class="form-control"
//           [class.is-invalid]="isFieldInvalid('vendorName')"
//         />
//         @if (isFieldInvalid('vendorName')) {
//           <span class="error-msg">Vendor or expense source is required.</span>
//         }
//       </div>

//       <!-- Expense Category -->
//       <div class="form-group">
//         <label>Expense Category <span class="required">*</span></label>
//         <select formControlName="category" class="form-control" [class.is-invalid]="isFieldInvalid('category')">
//           <option value="" disabled selected>Select category...</option>
//           @for (cat of expenseCategories; track cat) {
//             <option [value]="cat">{{ cat }}</option>
//           }
//         </select>
//         @if (isFieldInvalid('category')) {
//           <span class="error-msg">Category is required.</span>
//         }
//       </div>

//       <!-- Amount -->
//       <div class="form-group">
//         <label>Amount <span class="required">*</span></label>
//         <div class="currency-input-wrapper">
//           <span class="currency-symbol">₹</span>
//           <input
//             type="number"
//             formControlName="amount"
//             placeholder="0.00"
//             class="form-control pl-8"
//             [class.is-invalid]="isFieldInvalid('amount')"
//           />
//         </div>
//         @if (isFieldInvalid('amount')) {
//           <span class="error-msg">Amount must be greater than zero.</span>
//         }
//       </div>

//       <!-- Expense Date -->
//       <div class="form-group">
//         <label>Expense Date <span class="required">*</span></label>
//         <input
//           type="date"
//           formControlName="expenseDate"
//           class="form-control"
//           [class.is-invalid]="isFieldInvalid('expenseDate')"
//         />
//         @if (isFieldInvalid('expenseDate')) {
//           <span class="error-msg">Date is required.</span>
//         }
//       </div>

//       <!-- Payment Method -->
//       <div class="form-group">
//         <label>Payment Method <span class="required">*</span></label>
//         <select formControlName="paymentMethod" class="form-control" [class.is-invalid]="isFieldInvalid('paymentMethod')">
//           <option value="" disabled selected>Select payment method...</option>
//           @for (method of paymentMethods; track method) {
//             <option [value]="method">{{ method }}</option>
//           }
//         </select>
//         @if (isFieldInvalid('paymentMethod')) {
//           <span class="error-msg">Payment method is required.</span>
//         }
//       </div>

//       <!-- Description -->
//       <div class="form-group">
//         <label>Description</label>
//         <textarea
//           formControlName="description"
//           rows="3"
//           placeholder="Add details about the expense... (optional)"
//           class="form-control textarea"
//         ></textarea>
//       </div>

//       <!-- Form Action Buttons -->
//       <div class="form-actions">
//         <button type="button" (click)="onCancel()" class="btn btn-cancel">Cancel</button>
//         <button type="submit" [disabled]="isSubmitting()" class="btn btn-submit">
//           {{ isSubmitting() ? 'Saving...' : 'Save Expense' }}
//         </button>
//       </div>

//     </form>
