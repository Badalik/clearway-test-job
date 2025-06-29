import { AppRoute } from '@core/models';

import { DocumentViewPageComponent } from '@documents/pages/document-view';

import { LayoutComponent } from './layout/components/layout/layout.component';

export const routes: AppRoute[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'document-view/:id',
        component: DocumentViewPageComponent,
        data: {
          isDocument: true,
        },
      },
      { path: '', redirectTo: 'documents', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
