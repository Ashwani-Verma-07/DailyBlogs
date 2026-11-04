import {
  Component,
  EventEmitter,
  Output,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterLink, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface CurrentUser {
  id?: number;
  name: string;
  email: string;
  role?: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  constructor(private authService: AuthService) {}

  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('profileContainer')
  profileContainer!: ElementRef<HTMLElement>;

  currentUser: CurrentUser | null = null;

  ngOnInit(): void {
    this.loadCurrentUser();

    // Close dropdown after navigating to another route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.closeProfile());
  }

  loadCurrentUser(): void {
    this.http.get<CurrentUser>('http://localhost:8080/api/auth/me').subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('Current user loaded:', user);
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Unable to load current user:', error);
      },
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (
      this.isProfileOpen &&
      target instanceof Node &&
      this.profileContainer &&
      !this.profileContainer.nativeElement.contains(target)
    ) {
      this.closeProfile();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeProfile();
  }

  getInitials(name?: string | null): string {
    if (!name?.trim()) {
      return 'U';
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login'], {
      replaceUrl: true,
    });
  }

  @Output() sidebarToggle = new EventEmitter<void>();

  isProfileOpen = false;

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  closeProfile(): void {
    this.isProfileOpen = false;
  }
}
