import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable } from 'rxjs';

import { RouteService } from '@core/services/route.service';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {

  private readonly _routeService = inject(RouteService);

  private _title$ = new BehaviorSubject<string | null>(null);

  private _routeTitle$ = new BehaviorSubject<string | null>(null);

  public get title$(): Observable<string | null> {
    return this._title$.asObservable();
  }

  public get routeTitle$(): Observable<string | null> {
    return this._routeTitle$.asObservable();
  }

  constructor() {
    this._routeService.currentChildRoute
      .pipe(
        mergeMap((route) => route.title),
        map((title) => title ?? null),
      )
      .subscribe((title) => {
        this._routeTitle$.next(title);
      });
  }

  public setTitle(value: string | null): void {
    this._title$.next(value);
  }

}
