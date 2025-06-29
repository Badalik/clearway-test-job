import { inject, InjectionToken, Provider } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { RouteData } from '@core/models';
import { PageTitleService } from '@core/services/page-title.service';
import { RouteService } from '@core/services/route.service';

export const PAGE_TITLE_TOKEN = new InjectionToken<Observable<string | null>>('A stream with page title');

export const ROUTE_TITLE_TOKEN = new InjectionToken<Observable<string | null>>('A stream with route title');

export const IS_DOCUMENT_VIEW_ROUTE = new InjectionToken<Observable<boolean>>('Current route is document page');

export const HEADER_PROVIDERS: Provider[] = [
  {
    provide: ROUTE_TITLE_TOKEN,
    useFactory: routeTitleFactory,
  },
  {
    provide: PAGE_TITLE_TOKEN,
    useFactory: pageTitleFactory,
  },
  {
    provide: IS_DOCUMENT_VIEW_ROUTE,
    useFactory: isDocumentViewRouteFactory,
  },
];

export function routeTitleFactory(): Observable<string | null> {
  const pageTitleService = inject(PageTitleService);

  return pageTitleService.routeTitle$;
}

export function pageTitleFactory(): Observable<string | null> {
  const pageTitleService = inject(PageTitleService);

  return pageTitleService.title$;
}

export function isDocumentViewRouteFactory(): Observable<boolean> {
  const routeService = inject(RouteService);
  const subject$ = new BehaviorSubject<boolean>(false);

  routeService.currentChildRoute
    .pipe(
      map((route) => (route.snapshot.data as RouteData).isDocument ?? false),
    )
    .subscribe((isDocument) => {
      subject$.next(isDocument);
    });

  return subject$;
}
