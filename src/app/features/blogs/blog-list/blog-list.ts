import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Blog, BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-blog-list',

  standalone: true,

  templateUrl: './blog-list.html',

  styleUrl: './blog-list.css',
  imports: [FormsModule, DatePipe],
})
export class BlogList implements OnInit {
  blogs: Blog[] = [];

  filteredBlogs: Blog[] = [];

  searchTerm = '';

  selectedCategory = 'ALL';

  isLoading = false;

  errorMessage = '';

  constructor(
    private blogService: BlogService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  // ==========================================
  // LOAD BLOGS
  // ==========================================

  loadBlogs(): void {
    this.isLoading = true;

    this.errorMessage = '';

    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;

        this.filteredBlogs = [...blogs];

        this.isLoading = false;
        console.log(blogs);
      },

      error: (error) => {
        console.error('Failed to load blogs', error);

        this.isLoading = false;

        this.errorMessage = 'Unable to load your blogs.';
      },
    });
  }

  // ==========================================
  // SEARCH
  // ==========================================

  searchBlogs(): void {
    const search = this.searchTerm.trim().toLowerCase();

    this.filteredBlogs = this.blogs.filter((blog) => {
      const matchesSearch =
        !search ||
        blog.title.toLowerCase().includes(search) ||
        blog.content.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'ALL' || blog.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  // ==========================================
  // CATEGORY
  // ==========================================

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    this.searchBlogs();
  }

  // ==========================================
  // EDIT
  // ==========================================

  editBlog(id: number): void {
    this.router.navigate(['/blogs/edit', id]);
  }

  // ==========================================
  // CREATE
  // ==========================================

  createBlog(): void {
    this.router.navigate(['/blogs/create']);
  }

  // ==========================================
  // DELETE
  // ==========================================


deleteBlog(id: number): void {
  const blog = this.blogs.find(item => item.id === id);

  if (!blog) return;

  if (blog.status === 'PUBLISHED') {
    alert('Published blogs cannot be deleted.');
    return;
  }

  if (!confirm('Are you sure you want to delete this draft blog?')) {
    return;
  }

  // Save the current lists in case the API fails
  const previousBlogs = [...this.blogs];
  const previousFilteredBlogs = [...this.filteredBlogs];

  // Remove immediately from the UI
  this.blogs = this.blogs.filter(item => item.id !== id);
  this.filteredBlogs = this.filteredBlogs.filter(item => item.id !== id);

  this.blogService.deleteBlog(id).subscribe({
    next: () => {
      console.log('Blog deleted successfully:', id);
    },
    error: (error) => {
      // Restore the lists if deletion failed
      this.blogs = previousBlogs;
      this.filteredBlogs = previousFilteredBlogs;

      console.error('Failed to delete blog:', error);
      alert('Could not delete the blog. Please try again.');
    }
  });
}



  // ==========================================
  // CATEGORIES
  // ==========================================

  get categories(): string[] {
    return ['ALL', ...new Set(this.blogs.map((blog) => blog.category).filter(Boolean))];
  }

  // ==========================================
  // CONTENT PREVIEW
  // ==========================================

  getPreview(content: string): string {
    if (!content) {
      return '';
    }

    return content;
    //   return content.length > 150 ? content.substring(0, 150) + '...' : content;
  }

  selectedBlog: Blog | null = null;

  openBlog(blog: Blog): void {
    this.selectedBlog = blog;
    document.body.style.overflow = 'hidden';
  }

  closeBlog(): void {
    this.selectedBlog = null;
    document.body.style.overflow = '';
  }
  onModalKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    this.closeBlog();
  }
}
}
