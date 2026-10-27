import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
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
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { SearchField } from '../../../../shared/components/search-field/search-field';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';
import { Pagination } from '../../../../shared/components/pagination/pagination';

export interface Employee {
  id: string;
  employeeName: string;
  email: string;
  phoneNumber: string;
  department: string;
  designation: string;
  employeeStatus: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-all-employees',
  imports: [
    CommonModule,
    FormsModule,
    SelectComponent,
    PageHeader,
    ConfirmDialog,
    SearchField,
    StatusBadge,
    Pagination,
  ],
  templateUrl: './all-employees.html',
  styleUrl: './all-employees.scss',
})
export class AllEmployees implements OnInit {
  private router = inject(Router);

  private apiService = inject(ApiService);

  // Filters State Signals
  searchQuery = signal<string>('');
  selectedEmpIdFilter = signal<string>('All');
  selectedDepartmentFilter = signal<string>('All');
  selectedStatusFilter = signal<string>('All');
  employeeIdFilterOptions: SelectOption[] = [
    { value: 'All', label: 'Employee ID filter' },
    { value: 'EMP001', label: 'EMP001' },
    { value: 'EMP002', label: 'EMP002' },
    { value: 'EMP003', label: 'EMP003' },
  ];
  departmentFilterOptions: SelectOption[] = [
    { value: 'All', label: 'IT, HR, Operations' },
    { value: 'IT', label: 'IT' },
    { value: 'HR', label: 'HR' },
    { value: 'Operations', label: 'Operations' },
  ];
  statusFilterOptions: SelectOption[] = [
    { value: 'All', label: 'Active, Inactive' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  // Delete Modal & Loading Signals
  showDeleteModal = signal<boolean>(false);
  selectedEmployeeForDelete = signal<Employee | null>(null);
  isLoading = signal<boolean>(false);

  // Pagination Signals
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  // Employees Raw Data
  employees = signal<Employee[]>([]);

  // employees = signal<Employee[]>([
  //   {
  //     id: 'EMP001',
  //     name: 'John Doe',
  //     email: 'john.doe@hdfc.com',
  //     phone: '+91 9988776655',
  //     department: 'IT',
  //     designation: 'Software Engineer',
  //     status: 'Active',
  //   },
  //   {
  //     id: 'EMP002',
  //     name: 'Jane Smith',
  //     email: 'jane.smith@hdfc.com',
  //     phone: '+91 9988776654',
  //     department: 'HR',
  //     designation: 'HR Manager',
  //     status: 'Active',
  //   },
  //   {
  //     id: 'EMP003',
  //     name: 'Jane Smith',
  //     email: 'jane.doe@hdfc.com',
  //     phone: '+91 9988776655',
  //     department: 'IT',
  //     designation: 'Software Engineer',
  //     status: 'Active',
  //   },
  //   {
  //     id: 'EMP004',
  //     name: 'John Doe',
  //     email: 'john.doe@hdfc.com',
  //     phone: '+91 9988776655',
  //     department: 'IT',
  //     designation: 'Software Engineer',
  //     status: 'Active',
  //   },
  //   {
  //     id: 'EMP005',
  //     name: 'Jane Smith',
  //     email: 'jane.smith@hdfc.com',
  //     phone: '+91 9988776654',
  //     department: 'HR',
  //     designation: 'HR Manager',
  //     status: 'Active',
  //   },
  //   {
  //     id: 'EMP006',
  //     name: 'John Doe',
  //     email: 'john.doee@hdfc.com',
  //     phone: '+91 9988776655',
  //     department: 'IT',
  //     designation: 'HR Manager',
  //     status: 'Active',
  //   },
  // ]);

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.apiService.get<Employee[]>('employees/getAllEmployee').subscribe({
      next: (response) => {
        console.log('Fetched Employees:', response);
        this.employees.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.isLoading.set(false);
      },
    });
  }

  filteredEmployees = computed<Employee[]>(() => {
    const search = this.searchQuery().toLowerCase().trim();
    const list = this.employees();

    if (!search) {
      return list; // Agar search box khali hai toh poori list return hogi
    }

    return list.filter(
      (emp) =>
        (emp.employeeName && emp.employeeName.toLowerCase().includes(search)) ||
        (emp.email && emp.email.toLowerCase().includes(search)) ||
        (emp.id && emp.id.toLowerCase().includes(search)),
    );
  });

  paginatedEmployees = computed<Employee[]>(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredEmployees().slice(start, start + this.pageSize());
  });

  updateSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  updatePage(page: number): void {
    this.currentPage.set(page);
  }

  navigateToAddEmployee(): void {
    console.log('Navigating to Add Employee page...');
    this.router.navigate(['main-layout/add-employee']);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedEmpIdFilter.set('All');
    this.selectedDepartmentFilter.set('All');
    this.selectedStatusFilter.set('All');
    this.currentPage.set(1);
  }

  onView(emp: Employee): void {
    console.log('View Employee:', emp);
  }

  onEdit(emp: Employee): void {
    console.log('Edit Employee:', emp);
  }

  // Delete Dialog Triggers
  confirmDelete(emp: Employee): void {
    this.selectedEmployeeForDelete.set(emp);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedEmployeeForDelete.set(null);
  }

  executeDelete(): void {
    const target = this.selectedEmployeeForDelete();
    if (target) {
      this.isLoading.set(true);
      // Simulating API Deletion delay
      setTimeout(() => {
        this.employees.update((list) => list.filter((e) => e.id !== target.id));
        this.isLoading.set(false);
        this.closeDeleteModal();
      }, 600);
    }
  }
}
