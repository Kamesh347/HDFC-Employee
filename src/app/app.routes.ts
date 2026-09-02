import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { Login } from './features/auth/login/login';
import { AddIncome } from './features/transactions/pages/add-income/add-income';
import { MainLayout } from './layout/main-layout/main-layout';
import { AddEmployee } from './features/transactions/pages/add-employee/add-employee';
import { AddExpense } from './features/transactions/pages/add-expense/add-expense';
import { AllTransactions } from './features/transactions/pages/all-transactions/all-transactions';
import { AllEmployees } from './features/transactions/pages/all-employees/all-employees';
//import { AllEmployee } from './features/transactions/pages/all-employees/all-employee';

export const routes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: Login },

  {
    path: 'main-layout',
    component: MainLayout,
    children: [

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

    
      { path: 'dashboard', component: Dashboard },

     
      { path: 'add-income', component: AddIncome },

      {path: 'add-employee', component: AddEmployee},

      {path: 'add-expense', component: AddExpense},
    {path: 'all-transactions', component: AllTransactions},
    {path:'all-employees', component: AllEmployees},
    {path: 'add-income', component: AddIncome},
    ],
  },
  // {path: 'add-income', component: AddIncome}
];
