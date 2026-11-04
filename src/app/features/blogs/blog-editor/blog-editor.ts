import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog, BlogRequest, BlogService } from '../../../services/blog.service';
import { ImageUploadService } from '../../../services/image-upload.service';
@Component({
  selector: 'app-blog-editor',

  standalone: true,

  imports: [ReactiveFormsModule],

  templateUrl: './blog-editor.html',

  styleUrl: './blog-editor.css',
})
export class BlogEditor implements OnInit {
  private fb = inject(FormBuilder);

  blogId: number | null = null;

  isEditMode = false;

  isLoading = false;

  errorMessage = '';

  successMessage = '';

  categories = [
    'Daily Life & Lifestyle',

    'Technology & Innovation',

    'Travel & Exploration',

    'How-To-Do & Personal Insights',

    'Health & Wellness',

    'Career, Finance & Growth',

    'Other',
  ];

  blogForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],

    category: ['Daily Life & Lifestyle'],

    coverImage: [''],

    content: ['', [Validators.required]],

    status: ['DRAFT' as 'DRAFT' | 'PUBLISHED'],
  });

  constructor(
    private blogService: BlogService,

    private router: Router,

    private route: ActivatedRoute,

    private imageUploadService: ImageUploadService,

    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.blogId = Number(id);

      this.isEditMode = true;

      this.loadBlog();
    }
  }

  // ==========================================
  // GETTERS
  // ==========================================

  get title() {
    return this.blogForm.get('title');
  }

  get content() {
    return this.blogForm.get('content');
  }

  // ==========================================
  // LOAD BLOG
  // ==========================================

  loadBlog(): void {
    if (!this.blogId) {
      return;
    }

    this.isLoading = true;

    this.blogService.getBlog(this.blogId).subscribe({
      next: (blog) => {
        this.blogForm.patchValue({
          title: blog.title,

          category: blog.category || 'Daily Life & Lifestyle',

          coverImage: blog.coverImage || '',

          content: blog.content,

          status: blog.status,
        });

        this.isLoading = false;
      },

      error: (error) => {
        console.error(error);

        this.isLoading = false;

        this.errorMessage = 'Unable to load blog.';
      },
    });
  }

  // ==========================================
  // SAVE
  // ==========================================

  saveBlog(): void {
    if (this.isUploadingImage) {
      return;
    }
    if (this.imageError) {
      return;
    }
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    const request: BlogRequest = {
      title: this.blogForm.value.title!.trim(),

      content: this.blogForm.value.content!,

      category: this.blogForm.value.category || '',

      coverImage: this.blogForm.value.coverImage?.trim() || 'https://i.ibb.co/6SNCjTk/look.webp',

      status: this.blogForm.value.status!,
    };

    if (this.isEditMode && this.blogId) {
      this.updateBlog(request);
    } else {
      this.createBlog(request);
    }
  }

  // ==========================================
  // CREATE
  // ==========================================

  private createBlog(request: BlogRequest): void {
    this.blogService.createBlog(request).subscribe({
      next: (blog) => {
        console.log('Blog created:', blog);

        this.isLoading = false;

        this.successMessage = 'Blog created successfully!';

        setTimeout(() => {
          this.router.navigate(['/blogs']);
        }, 700);
      },

      error: (error) => {
        console.error(error);

        this.isLoading = false;

        this.errorMessage = 'Unable to create blog.';
      },
    });
  }

  // ==========================================
  // UPDATE
  // ==========================================

  private updateBlog(request: BlogRequest): void {
    this.blogService.updateBlog(this.blogId!, request).subscribe({
      next: (blog) => {
        console.log('Blog updated:', blog);

        this.isLoading = false;

        this.successMessage = 'Blog updated successfully!';

        setTimeout(() => {
          this.router.navigate(['/blogs']);
        }, 700);
      },

      error: (error) => {
        console.error(error);

        this.isLoading = false;

        this.errorMessage = 'Unable to update blog.';
      },
    });
  }

  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {
    this.router.navigate(['/blogs']);
  }

  selectedCoverFile: File | null = null;
  coverPreview: string | null = null;
  selectedFileName = '';
  imageError = '';
  isUploadingImage = false;


onCoverSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  if (this.isUploadingImage) return;

  this.imageError = '';

  const allowedTypes = ['image/jpeg', 'image/png'];

  if (!allowedTypes.includes(file.type)) {
    this.imageError = 'Only JPG and PNG images are allowed.';
    input.value = '';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    this.imageError = 'Image must not exceed 5 MB.';
    input.value = '';
    return;
  }

  this.clearObjectPreview();

  this.selectedCoverFile = file;
  this.selectedFileName = file.name;
  this.coverPreview = URL.createObjectURL(file);
  this.isUploadingImage = true;

  console.log('Cloudinary upload started:', file.name);

  this.imageUploadService.uploadImage(file).subscribe({
    next: (response) => {
      console.log('Cloudinary upload successful:', response);

      this.blogForm.patchValue({
        coverImage: response.secure_url
      });

      this.clearObjectPreview();
      this.coverPreview = response.secure_url;
      this.selectedCoverFile = null;
      this.isUploadingImage = false;

      input.value = '';

      this.cdr.detectChanges();
      console.log('isUploadingImage:', this.isUploadingImage);
    },

    error: (error) => {
      console.error('Cloudinary upload failed:', error);

      this.isUploadingImage = false;
      this.imageError =
        error?.error?.error?.message ||
        'Image upload failed. Please try again.';

      input.value = '';
      console.log('isUploadingImage:', this.isUploadingImage);
    },

    complete: () => {
      console.log('Cloudinary upload request completed.');
    }
  });
}


  private clearObjectPreview(): void {
    if (this.coverPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(this.coverPreview);
    }
  }

onCoverUrlChange(): void {
  this.clearObjectPreview();

  this.selectedCoverFile = null;
  this.selectedFileName = '';
  this.imageError = '';

  const url = this.blogForm.get('coverImage')?.value?.trim() || '';

  this.coverPreview = /^https?:\/\//i.test(url) ? url : null;

  const fileInput = document.getElementById(
    'coverFile'
  ) as HTMLInputElement | null;

  if (fileInput) fileInput.value = '';
}

  removeCoverImage(): void {
    this.clearObjectPreview();

    this.selectedCoverFile = null;
    this.coverPreview = null;
    this.selectedFileName = '';
    this.imageError = '';

    this.blogForm.patchValue({
      coverImage: '',
    });

    // Reset inputs so the same file can be selected again.
    const fileInput = document.getElementById('coverFile') as HTMLInputElement | null;

    const cameraInput = document.getElementById('cameraFile') as HTMLInputElement | null;

    if (fileInput) fileInput.value = '';
    if (cameraInput) cameraInput.value = '';
  }
}
