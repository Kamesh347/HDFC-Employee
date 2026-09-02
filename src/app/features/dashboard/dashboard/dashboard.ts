import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet, RouterLinkWithHref, ActivatedRoute } from '@angular/router';
import { Sidebar } from '../../../layout/sidebar/sidebar';
import { Navbar } from '../../../layout/navbar/navbar';

export interface Transaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  category: string;
  amount: number;
  status: 'Successful' | 'Pending' | 'Failed';
}

export interface CategoryExpense {
  category: string;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  // Signals State
  selectedMonth = signal<string>('October 2023');
  dateRangeFilter = signal<string>('October 2023');
  isLoading = signal<boolean>(false);

  // Summary Metrics Signals
  totalIncome = signal<number>(90000);
  totalExpenses = signal<number>(37000);
  netSavings = computed(() => this.totalIncome() - this.totalExpenses());
  totalTransactionsCount = signal<number>(24);

  // Expense Distribution Data
  expenseCategories = signal<CategoryExpense[]>([
    { category: 'Food', percentage: 25, color: '#1e293b' },
    { category: 'Rent', percentage: 30, color: '#e31837' },
    { category: 'Transportation', percentage: 15, color: '#10b981' },
    { category: 'Shopping', percentage: 10, color: '#3b82f6' },
    { category: 'Utilities', percentage: 12, color: '#8b5cf6' },
    { category: 'Other', percentage: 8, color: '#64748b' },
  ]);

  // Recent Transactions Data
  recentTransactions = signal<Transaction[]>([
    {
      id: '1',
      date: '28 Oct',
      type: 'INCOME',
      description: 'Salary',
      category: 'Salary',
      amount: 75000,
      status: 'Successful',
    },
    {
      id: '2',
      date: '29 Oct',
      type: 'EXPENSE',
      description: 'Groceries',
      category: 'Food',
      amount: 1500,
      status: 'Pending',
    },
    {
      id: '3',
      date: '28 Oct',
      type: 'EXPENSE',
      description: 'Groceries',
      category: 'Food',
      amount: 1500,
      status: 'Pending',
    },
    {
      id: '4',
      date: '28 Oct',
      type: 'INCOME',
      description: 'Salary / Intercompany',
      category: 'Salary',
      amount: 75000,
      status: 'Pending',
    },
  ]);

  refreshData(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 800);
  }

  // Quick Action Handlers
  onAddIncome(): void {
    console.log('Open Add Income Modal');
    this.router.navigate(['/main-layout/add-income'], { relativeTo: this.route });
  }

  onAddExpense(): void {
    console.log('Open Add Expense Modal');
    this.router.navigate(['/main-layout/add-expense']);
  }

  onViewTransactions(): void {
    console.log('Navigate to Transactions View');
  }

  onGenerateReport(): void {
    console.log('Trigger Monthly Report Generation');
  }
}
