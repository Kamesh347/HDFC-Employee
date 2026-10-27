import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private router = inject(Router);

  showDropdown = signal<boolean>(false);
  userName = signal<string>('Kamesh Dongre');
  empId = signal<string>('EMP001');

  toggleDropdown(): void {
    this.showDropdown.update((val) => !val);
  }

  logout(): void {
    this.showDropdown.set(false);
    this.router.navigate(['/Login']);
  }
}
