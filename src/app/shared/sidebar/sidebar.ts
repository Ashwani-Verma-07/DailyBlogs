import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  logout(): void {
  this.authService.logout();

  this.router.navigate(['/login'], {
    replaceUrl: true
  });
}

  @Input() isOpen = false;

  @Output() sidebarClose = new EventEmitter<void>();

  closeSidebar(): void {
    this.sidebarClose.emit();
  }
}