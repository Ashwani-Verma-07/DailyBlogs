import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { authGuard } from './guards/auth.guard';
import { BlogList } from './features/blogs/blog-list/blog-list';
import { BlogEditor } from './features/blogs/blog-editor/blog-editor';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password').then((m) => m.ResetPassword),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'blogs',
        component: BlogList,
      },
      {
        path: 'blogs/create',
        component: BlogEditor,
      },
      {
        path: 'blogs/edit/:id',
        component: BlogEditor,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
