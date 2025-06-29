import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteService {

  private readonly _route = inject(ActivatedRoute);

  private readonly _router = inject(Router);

  public get currentChildRoute(): Observable<ActivatedRoute> {
    return this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this._route),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }

          return route;
        }),
        filter((route) => route.outlet === 'primary'),
      );
  }
}
