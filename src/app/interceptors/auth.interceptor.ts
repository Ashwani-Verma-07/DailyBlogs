
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Cloudinary unsigned uploads must not receive the backend JWT.
  if (req.url.startsWith('https://api.cloudinary.com/')) {
    return next(req);
  }

  const token = localStorage.getItem('tasktracker_token');

  // Don't modify the request if the user isn't logged in.
  if (!token) {
    return next(req);
  }

  // Attach the JWT to requests sent to your Spring Boot backend.
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
