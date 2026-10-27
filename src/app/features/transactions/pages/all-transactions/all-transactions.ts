import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  SelectComponent,
  SelectOption,
} from '../../../../shared/components/select-component/select-component';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { SearchField } from '../../../../shared/components/search-field/search-field';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';
import { Pagination } from '../../../../shared/components/pagination/pagination';

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

export interface StatementReviewItem extends TransactionItem {
  sourceRow: number;
}

@Component({
  selector: 'app-all-transactions',
  imports: [
    FormsModule,
    CommonModule,
    SelectComponent,
    PageHeader,
    StatCard,
    SearchField,
    StatusBadge,
    Pagination,
  ],
  templateUrl: './all-transactions.html',
  styleUrl: './all-transactions.scss',
})
export class AllTransactions {
  private router = inject(Router);

  statementFileName = signal<string>('');
  statementRows = signal<StatementReviewItem[]>([]);
  statementError = signal<string>('');
  isReadingStatement = signal<boolean>(false);
  statementImported = signal<boolean>(false);
  statementCredits = computed(() =>
    this.statementRows()
      .filter((row) => row.type === 'Income')
      .reduce((total, row) => total + row.amount, 0),
  );
  statementDebits = computed(() =>
    this.statementRows()
      .filter((row) => row.type === 'Expense')
      .reduce((total, row) => total + row.amount, 0),
  );
  statementNet = computed(() => this.statementCredits() - this.statementDebits());

  readonly statementCategories = [
    'Food & Dining',
    'Transport',
    'Shopping',
    'Bills & Utilities',
    'Health',
    'Income',
    'Transfer',
    'Other',
  ];

  // Filter Signals
  searchQuery = signal<string>('');
  selectedType = signal<string>('All');
  selectedEmployee = signal<string>('All Employees');
  selectedCategory = signal<string>('All Categories');
  typeOptions: SelectOption[] = [
    { value: 'All', label: 'All' },
    { value: 'Income', label: 'Income' },
    { value: 'Expense', label: 'Expense' },
  ];
  employeeOptions: SelectOption[] = [
    { value: 'All Employees', label: 'All Employees' },
    { value: 'Full Name', label: 'Full Name' },
    { value: 'EMP ID', label: 'EMP ID' },
  ];
  categoryOptions: SelectOption[] = [
    { value: 'All Categories', label: 'All Categories' },
    { value: 'Food', label: 'Food' },
    { value: 'Salary', label: 'Salary' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Food & Dining', label: 'Food & Dining' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Bills & Utilities', label: 'Bills & Utilities' },
    { value: 'Health', label: 'Health' },
    { value: 'Income', label: 'Income' },
    { value: 'Transfer', label: 'Transfer' },
    { value: 'Other', label: 'Other' },
  ];
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
    {
      id: '1',
      date: '28 Oct 2023',
      type: 'Income',
      employee: 'Full Name',
      description: 'Groceries',
      category: 'Food',
      amount: 5000,
      paymentMethod: 'Credit Card',
    },
    {
      id: '2',
      date: '28 Oct 2023',
      type: 'Expense',
      employee: 'Full Name',
      description: 'Salary Credit',
      category: 'Salary',
      amount: 75000,
      paymentMethod: 'Bank Transfer',
    },
    {
      id: '3',
      date: '28 Oct 2023',
      type: 'Income',
      employee: 'EMP ID',
      description: 'Electricity Bill',
      category: 'Utilities',
      amount: 5000,
      paymentMethod: 'Bank Transfer',
    },
    {
      id: '4',
      date: '28 Oct 2023',
      type: 'Expense',
      employee: 'Full Name',
      description: 'Groceries',
      category: 'Food',
      amount: 75000,
      paymentMethod: 'Credit Card',
    },
    {
      id: '5',
      date: '28 Oct 2023',
      type: 'Expense',
      employee: 'Full Name',
      description: 'Salary Credit',
      category: 'Utilities',
      amount: 75000,
      paymentMethod: 'Bank Transfer',
    },
    {
      id: '6',
      date: '28 Oct 2023',
      type: 'Expense',
      employee: 'Full Name',
      description: 'Salary Credit',
      category: 'Utilities',
      amount: 5000,
      paymentMethod: 'Credit Card',
    },
    {
      id: '7',
      date: '24 Oct 2023',
      type: 'Expense',
      employee: 'Full Name',
      description: 'Salary Credit',
      category: 'Salary',
      amount: 75000,
      paymentMethod: 'Bank Transfer',
    },
    {
      id: '8',
      date: '28 Oct 2023',
      type: 'Expense',
      employee: 'EMP ID',
      description: 'Electricity Bill',
      category: 'Utilities',
      amount: 75000,
      paymentMethod: 'Cash',
    },
    {
      id: '9',
      date: '20 Oct 2023',
      type: 'Income',
      employee: 'Full Name',
      description: 'Groceries',
      category: 'Food',
      amount: 5000,
      paymentMethod: 'Credit Card',
    },
  ]);

  // Filtered List Computed Signal
  filteredTransactions = computed(() => {
    return this.transactions().filter((item) => {
      const matchesSearch =
        !this.searchQuery() ||
        item.description.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        item.employee.toLowerCase().includes(this.searchQuery().toLowerCase());

      const matchesType = this.selectedType() === 'All' || item.type === this.selectedType();
      const matchesCategory =
        this.selectedCategory() === 'All Categories' || item.category === this.selectedCategory();
      const matchesEmployee =
        this.selectedEmployee() === 'All Employees' || item.employee === this.selectedEmployee();

      return matchesSearch && matchesType && matchesCategory && matchesEmployee;
    });
  });

  paginatedTransactions = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredTransactions().slice(start, start + this.pageSize());
  });

  updateSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  async onStatementSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.statementError.set('');
    this.statementRows.set([]);
    this.statementImported.set(false);
    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.statementError.set('Choose a CSV statement file.');
      input.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.statementError.set('The file is larger than 10 MB.');
      input.value = '';
      return;
    }

    this.isReadingStatement.set(true);
    this.statementFileName.set(file.name);
    try {
      const rows = this.parseStatementCsv(await file.text());
      if (!rows.length) {
        this.statementError.set(
          'No transactions found. Check that the CSV has date, description, and amount columns.',
        );
      } else {
        this.statementRows.set(rows);
      }
    } catch {
      this.statementError.set(
        'This statement could not be read. Check the CSV format and try again.',
      );
    } finally {
      this.isReadingStatement.set(false);
      input.value = '';
    }
  }

  parseStatementCsv(csv: string): StatementReviewItem[] {
    const firstLine = csv.split(/\r?\n/, 1)[0] ?? '';
    const delimiter = this.detectDelimiter(firstLine);
    const records = this.readCsvRecords(csv, delimiter).filter((record) =>
      record.some((cell) => cell.trim() !== ''),
    );
    if (records.length < 2) return [];

    const headerRowIndex = records.slice(0, 10).findIndex((record) => {
      const candidateHeaders = record.map((header) => this.normalizeHeader(header));
      const hasDate =
        this.findHeader(candidateHeaders, [
          'date',
          'transactiondate',
          'trandate',
          'valuedate',
          'postingdate',
        ]) >= 0;
      const hasDescription =
        this.findHeader(candidateHeaders, [
          'description',
          'narration',
          'particulars',
          'remarks',
          'details',
          'merchant',
          'payee',
          'transactionparticulars',
        ]) >= 0;
      const hasAmount =
        this.findHeader(candidateHeaders, [
          'debit',
          'debitamount',
          'debitamt',
          'withdrawal',
          'withdrawals',
          'withdrawalamount',
          'withdrawalamt',
          'paidout',
          'credit',
          'creditamount',
          'creditamt',
          'deposit',
          'deposits',
          'depositamount',
          'depositamt',
          'paidin',
          'amount',
          'transactionamount',
          'tranamount',
          'value',
        ]) >= 0;
      return hasDate && hasDescription && hasAmount;
    });
    if (headerRowIndex < 0) throw new Error('Statement headers were not found');

    const headers = records[headerRowIndex].map((header) => this.normalizeHeader(header));
    const dateIndex = this.findHeader(headers, [
      'date',
      'transactiondate',
      'trandate',
      'valuedate',
      'postingdate',
    ]);
    const descriptionIndex = this.findHeader(headers, [
      'description',
      'narration',
      'particulars',
      'remarks',
      'details',
      'merchant',
      'payee',
      'transactionparticulars',
    ]);
    const debitIndex = this.findHeader(headers, [
      'debit',
      'debitamount',
      'debitamt',
      'withdrawal',
      'withdrawals',
      'withdrawalamount',
      'withdrawalamt',
      'paidout',
    ]);
    const creditIndex = this.findHeader(headers, [
      'credit',
      'creditamount',
      'creditamt',
      'deposit',
      'deposits',
      'depositamount',
      'depositamt',
      'paidin',
    ]);
    const amountIndex = this.findHeader(headers, [
      'amount',
      'transactionamount',
      'tranamount',
      'value',
    ]);
    const typeIndex = this.findHeader(headers, ['type', 'transactiontype', 'drcr', 'indicator']);
    if (
      dateIndex < 0 ||
      descriptionIndex < 0 ||
      (debitIndex < 0 && creditIndex < 0 && amountIndex < 0)
    ) {
      throw new Error('Required statement columns are missing');
    }

    const reviewRows: StatementReviewItem[] = [];
    records.slice(headerRowIndex + 1).forEach((record, index) => {
      const description = (record[descriptionIndex] ?? '').trim();
      const rawDate = (record[dateIndex] ?? '').trim();
      const debit = debitIndex >= 0 ? Math.abs(this.parseAmount(record[debitIndex])) : 0;
      const credit = creditIndex >= 0 ? Math.abs(this.parseAmount(record[creditIndex])) : 0;
      const rawAmount = amountIndex >= 0 ? this.parseAmount(record[amountIndex]) : 0;
      const typeHint = typeIndex >= 0 ? (record[typeIndex] ?? '').trim().toLowerCase() : '';

      let type: TransactionItem['type'];
      let amount: number;
      if (debit > 0 || credit > 0) {
        type = credit > 0 ? 'Income' : 'Expense';
        amount = credit > 0 ? credit : debit;
      } else if (rawAmount !== 0) {
        const isCredit = /credit|deposit|\bcr\b/.test(typeHint)
          ? true
          : /debit|withdraw|\bdr\b/.test(typeHint)
            ? false
            : rawAmount > 0;
        type = isCredit ? 'Income' : 'Expense';
        amount = Math.abs(rawAmount);
      } else {
        return;
      }

      if (!description || !rawDate || !Number.isFinite(amount) || amount <= 0) return;
      reviewRows.push({
        id: `statement-${Date.now()}-${index}`,
        sourceRow: headerRowIndex + index + 2,
        date: this.normalizeStatementDate(rawDate),
        type,
        employee: 'Statement import',
        description,
        category: this.suggestCategory(description, type),
        amount,
        paymentMethod: 'Bank statement',
      });
    });

    return reviewRows.slice(0, 5000);
  }

  updateStatementRow(id: string, field: 'description' | 'category', value: string): void {
    this.statementRows.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  }

  importStatementRows(): void {
    const importedRows = this.statementRows();
    if (!importedRows.length) return;

    const transactions = importedRows.map(
      ({ sourceRow: _sourceRow, ...transaction }) => transaction,
    );
    const credits = importedRows
      .filter((row) => row.type === 'Income')
      .reduce((total, row) => total + row.amount, 0);
    const debits = importedRows
      .filter((row) => row.type === 'Expense')
      .reduce((total, row) => total + row.amount, 0);

    this.transactions.update((current) => [...transactions, ...current]);
    this.totalTransactionsCount.update((count) => count + importedRows.length);
    this.totalIncomeAmount.update((total) => total + credits);
    this.totalExpenseAmount.update((total) => total + debits);
    this.statementImported.set(true);
    this.statementRows.set([]);
    this.currentPage.set(1);
    this.selectedType.set('All');
    this.selectedCategory.set('All Categories');
    this.selectedEmployee.set('All Employees');
    this.searchQuery.set('');
  }

  downloadStatementTemplate(): void {
    const csv =
      'Date,Description,Debit,Credit\n2026-10-01,Coffee shop,250.00,\n2026-10-02,Salary,,45000.00\n';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'statement-template.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private detectDelimiter(header: string): string {
    const candidates = [',', ';', '\t', '|'];
    return candidates.reduce(
      (selected, candidate) =>
        header.split(candidate).length > header.split(selected).length ? candidate : selected,
      ',',
    );
  }

  private readCsvRecords(csv: string, delimiter: string): string[][] {
    const records: string[][] = [];
    let record: string[] = [];
    let cell = '';
    let quoted = false;

    for (let index = 0; index < csv.length; index += 1) {
      const character = csv[index];
      if (character === '"' && quoted && csv[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = !quoted;
      } else if (character === delimiter && !quoted) {
        record.push(cell);
        cell = '';
      } else if ((character === '\n' || character === '\r') && !quoted) {
        if (character === '\r' && csv[index + 1] === '\n') index += 1;
        record.push(cell);
        records.push(record);
        record = [];
        cell = '';
      } else {
        cell += character;
      }
    }

    if (cell || record.length) {
      record.push(cell);
      records.push(record);
    }
    return records;
  }

  private normalizeHeader(header: string): string {
    return header
      .replace(/^\uFEFF/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  private findHeader(headers: string[], aliases: string[]): number {
    return headers.findIndex((header) => aliases.includes(header));
  }

  private parseAmount(value = ''): number {
    const normalized = value
      .trim()
      .replace(/[₹,$\s]/g, '')
      .replace(/[()]/g, (token) => token);
    if (!normalized) return 0;
    const isParenthesized = normalized.startsWith('(') && normalized.endsWith(')');
    const amount = Number(normalized.replace(/[()]/g, '').replace(/,/g, ''));
    return Number.isFinite(amount) ? (isParenthesized ? -Math.abs(amount) : amount) : 0;
  }

  private normalizeStatementDate(value: string): string {
    const iso = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (iso)
      return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])).toLocaleDateString(
        'en-IN',
      );
    const local = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
    if (local) {
      const year = Number(local[3]) < 100 ? 2000 + Number(local[3]) : Number(local[3]);
      return new Date(year, Number(local[2]) - 1, Number(local[1])).toLocaleDateString('en-IN');
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-IN');
  }

  private suggestCategory(description: string, type: TransactionItem['type']): string {
    if (type === 'Income') return /salary|payroll/i.test(description) ? 'Income' : 'Transfer';
    if (/food|cafe|restaurant|grocery|swiggy|zomato/i.test(description)) return 'Food & Dining';
    if (/uber|ola|fuel|petrol|metro|transport/i.test(description)) return 'Transport';
    if (/amazon|flipkart|shopping|store/i.test(description)) return 'Shopping';
    if (/electric|water|internet|bill|utility/i.test(description)) return 'Bills & Utilities';
    if (/pharmacy|hospital|medical|health/i.test(description)) return 'Health';
    return 'Other';
  }

  updatePage(page: number): void {
    this.currentPage.set(page);
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedType.set('All');
    this.selectedEmployee.set('All Employees');
    this.selectedCategory.set('All Categories');
    this.startDate.set('');
    this.endDate.set('');
    this.minAmount.set(null);
    this.maxAmount.set(null);
    this.currentPage.set(1);
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
    this.transactions.update((items) => items.filter((t) => t.id !== id));
  }
}
