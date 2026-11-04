import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  coverImage: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
}

export interface BlogRequest {
  title: string;
  content: string;
  category: string;
  coverImage: string;
  status: 'DRAFT' | 'PUBLISHED';
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly apiUrl = 'http://localhost:8080/api/blogs';

  constructor(private http: HttpClient) {}

  //get all blogs
  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  // ==========================================
  // GET BLOG BY ID
  // ==========================================

  getBlog(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }
  // UPDATE BLOG
  // ==========================================

  updateBlog(id: number, request: BlogRequest): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, request);
  }

  //Create
    createBlog(
    request: BlogRequest
  ): Observable<Blog> {

    return this.http.post<Blog>(
      this.apiUrl,
      request
    );

  }

  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
