import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);

  navItems = [
    {
      label: 'Dashboard',
      link: '/main-layout/dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },

    {
      label: 'Employees',
      link: '/main-layout/all-employees',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
      label: 'Add Employee',
      link: '/main-layout/add-employee',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
    },

    {
      label: 'Add Income',
      link: '/main-layout/add-income',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
    },
    {
      label: 'Add Expense',
      link: '/main-layout/add-expense',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
    },
    {
      label: 'Transactions',
      link: '/main-layout/all-transactions',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      label: 'Reports',
      link: '/main-layout/reports',
      icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z',
    },
  ];
}
