import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from './blog.service';

export interface DashboardData {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalCategories: number;
  recentBlogs: Blog[];
  draftBlogsList: Blog[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl =
    'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl);
  }
}