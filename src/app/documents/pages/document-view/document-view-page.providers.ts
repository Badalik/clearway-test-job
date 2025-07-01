import { inject, InjectionToken, Provider, signal, WritableSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { concatMap, finalize, from, Observable, take, tap } from 'rxjs';

import { DocumentResponse } from '@core/models';
import { ApiFilesService } from '@core/services/api-files.service';
import { ApiService } from '@core/services/api.service';
import { PageTitleService } from '@core/services/page-title.service';
import { DocumentControlsService } from '@documents/services/document-controls.service';

export const DOCUMENT_TOKEN = new InjectionToken<Observable<DocumentResponse>>(
  'A stream with document',
);

export const DOCUMENT_PAGES_TOKEN = new InjectionToken<WritableSignal<Blob[] | null>>(
  'A stream with document pages',
);

export const DOCUMENT_VIEW_PAGE_PROVIDERS: Provider[] = [
  {
    provide: DOCUMENT_TOKEN,
    useFactory: documentFactory,
  },
  {
    provide: DOCUMENT_PAGES_TOKEN,
    useValue: signal<Blob[] | null>(null),
  },
];

export function documentFactory(): Observable<DocumentResponse> {
  const route = inject(ActivatedRoute);
  const apiService = inject(ApiService);
  const apiFilesService = inject(ApiFilesService);
  const titleService = inject(Title);
  const pageTitleService = inject(PageTitleService);
  const documentControlsService = inject(DocumentControlsService);
  const documentPages = inject(DOCUMENT_PAGES_TOKEN);

  return apiService.getDocumentById(route.snapshot.paramMap.get('id'))
    .pipe(
      tap((res) => {
        const pages = res.pages;
        const blobs: Blob[] = [];

        documentControlsService.setCurrentDocument(res);
        titleService.setTitle(res.name ?? '');
        pageTitleService.setTitle(res.name ?? null);

        if (pages?.length) {
          from(pages)
            .pipe(
              concatMap((page) => apiFilesService.downloadImage(page.imageUrl)),
              tap((blob) => blobs.push(blob)),
              take(pages.length),
              finalize(() => {
                if (blobs.length) {
                  documentPages.set(blobs);
                }
              }),
            )
            .subscribe();
        }
      }),
    );
}
