import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


export interface TransactionItem {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  employee: string;
  description: string;
  category: string;
  amount: number;
  paymentMethod: string;
}

@Component({
  selector: 'app-all-transactions',
  imports: [FormsModule, CommonModule],
  templateUrl: './all-transactions.html',
  styleUrl: './all-transactions.scss',
})
export class AllTransactions {

  private router = inject(Router);

  // Filter Signals
  searchQuery = signal<string>('');
  selectedType = signal<string>('All');
  selectedEmployee = signal<string>('All Employees');
  selectedCategory = signal<string>('All Categories');
  startDate = signal<string>('');
  endDate = signal<string>('');
  minAmount = signal<number | null>(null);
  maxAmount = signal<number | null>(null);

  // Pagination Signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  // Summary Metrics Signals
  totalTransactionsCount = signal<number>(1245);
  totalIncomeAmount = signal<number>(1140000);
  totalExpenseAmount = signal<number>(420000);
  netBalance = computed(() => this.totalIncomeAmount() - this.totalExpenseAmount());

  // Raw Transactions Data
  transactions = signal<TransactionItem[]>([
    { id: '1', date: '28 Oct 2023', type: 'Income', employee: 'Full Name', description: 'Groceries', category: 'Food', amount: 5000, paymentMethod: 'Credit Card' },
    { id: '2', date: '28 Oct 2023', type: 'Expense', employee: 'Full Name', description: 'Salary Credit', category: 'Salary', amount: 75000, paymentMethod: 'Bank Transfer' },
    { id: '3', date: '28 Oct 2023', type: 'Income', employee: 'EMP ID', description: 'Electricity Bill', category: 'Utilities', amount: 5000, paymentMethod: 'Bank Transfer' },
    { id: '4', date: '28 Oct 2023', type: 'Expense', employee: 'Full Name', description: 'Groceries', category: 'Food', amount: 75000, paymentMethod: 'Credit Card' },
    { id: '5', date: '28 Oct 2023', type: 'Expense', employee: 'Full Name', description: 'Salary Credit', category: 'Utilities', amount: 75000, paymentMethod: 'Bank Transfer' },
    { id: '6', date: '28 Oct 2023', type: 'Expense', employee: 'Full Name', description: 'Salary Credit', category: 'Utilities', amount: 5000, paymentMethod: 'Credit Card' },
    { id: '7', date: '24 Oct 2023', type: 'Expense', employee: 'Full Name', description: 'Salary Credit', category: 'Salary', amount: 75000, paymentMethod: 'Bank Transfer' },
    { id: '8', date: '28 Oct 2023', type: 'Expense', employee: 'EMP ID', description: 'Electricity Bill', category: 'Utilities', amount: 75000, paymentMethod: 'Cash' },
    { id: '9', date: '20 Oct 2023', type: 'Income', employee: 'Full Name', description: 'Groceries', category: 'Food', amount: 5000, paymentMethod: 'Credit Card' }
  ]);

  // Filtered List Computed Signal
  filteredTransactions = computed(() => {
    return this.transactions().filter(item => {
      const matchesSearch = !this.searchQuery() || 
        item.description.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        item.employee.toLowerCase().includes(this.searchQuery().toLowerCase());

      const matchesType = this.selectedType() === 'All' || item.type === this.selectedType();
      const matchesCategory = this.selectedCategory() === 'All Categories' || item.category === this.selectedCategory();
      const matchesEmployee = this.selectedEmployee() === 'All Employees' || item.employee === this.selectedEmployee();

      return matchesSearch && matchesType && matchesCategory && matchesEmployee;
    });
  });

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedType.set('All');
    this.selectedEmployee.set('All Employees');
    this.selectedCategory.set('All Categories');
    this.startDate.set('');
    this.endDate.set('');
    this.minAmount.set(null);
    this.maxAmount.set(null);
  }

  exportData(): void {
    console.log('Exporting transactions report...');
  }

  onView(item: TransactionItem): void {
    console.log('View Transaction:', item);
  }

  onEdit(item: TransactionItem): void {
    console.log('Edit Transaction:', item);
  }

  onDelete(id: string): void {
    this.transactions.update(items => items.filter(t => t.id !== id));
  }

}
