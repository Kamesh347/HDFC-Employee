import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authService = inject(Auth);

  showDropdown = signal<boolean>(false);
  userName = signal<string>('Kamesh Dongre');
  empId = signal<string>('EMP001');

  toggleDropdown(): void {
    this.showDropdown.update((val) => !val);
  }

  logout(): void {
    // this.authService.logout();
  }
}
