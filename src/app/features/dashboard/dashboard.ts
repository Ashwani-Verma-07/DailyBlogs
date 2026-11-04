import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DashboardData, DashboardService } from '../../services/dashboard.service';

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role?: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  dashboard: DashboardData | null = null;
  currentUser: CurrentUser | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
  ) {}

  loadCurrentUser(): void {
  this.http
    .get<CurrentUser>('http://localhost:8080/api/auth/me')
    .subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Unable to load current user:', error);
      }
    });
}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDashboard();
  }
  

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = {
          totalBlogs: data.totalBlogs ?? 0,
          publishedBlogs: data.publishedBlogs ?? 0,
          draftBlogs: data.draftBlogs ?? 0,
          totalCategories: data.totalCategories ?? 0,
          recentBlogs: data.recentBlogs ?? [],
          draftBlogsList: data.draftBlogsList ?? [],
        };

        this.isLoading = false;

        this.cdr.detectChanges();

        console.log('Dashboard state:', {
          isLoading: this.isLoading,
          dashboard: this.dashboard,
        });
      },
      error: (error) => {
        console.error('Dashboard API error:', error);

        this.isLoading = false;
        this.errorMessage = 'Unable to load dashboard. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }

  createBlog(): void {
    this.router.navigate(['/blogs/create']);
  }

  viewBlogs(): void {
    this.router.navigate(['/blogs']);
  }

  editBlog(id: number): void {
    this.router.navigate(['/blogs/edit', id]);
  }

  getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
}
