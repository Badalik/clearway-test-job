import { Route } from '@angular/router';

export interface AppRoute extends Route {
  data?: RouteData;
}

export interface RouteData {
  isDocument?: boolean;
}
