
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
}

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private readonly cloudName = 'rfgcgwkb';
  private readonly uploadPreset = 'blog_images';

  private readonly uploadUrl =
    `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<CloudinaryUploadResponse>(
      this.uploadUrl,
      formData
    );
  }
}
