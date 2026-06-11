import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'bookmarks',
    loadComponent: () =>
      import('./features/bookmarks/bookmarks.component').then((m) => m.BookmarksComponent),
  },
  {
    path: 'project/:owner/:repo',
    loadComponent: () =>
      import('./features/project-details/project-details.component').then(
        (m) => m.ProjectDetailsComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
