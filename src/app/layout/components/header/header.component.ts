import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ContainerComponent } from '@shared/components/container';

import { HEADER_PROVIDERS, IS_DOCUMENT_VIEW_ROUTE, PAGE_TITLE_TOKEN, ROUTE_TITLE_TOKEN } from './header.providers';
import { DocumentViewControlComponent } from '../document-view-control';

@Component({
  selector: 'app-header',
  imports: [
    ContainerComponent,
    DocumentViewControlComponent,
    AsyncPipe,
  ],
  providers: HEADER_PROVIDERS,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  protected readonly routeTitle$ = inject(ROUTE_TITLE_TOKEN);

  protected readonly pageTitle$ = inject(PAGE_TITLE_TOKEN);

  protected readonly isDocumentViewRoute$ = inject(IS_DOCUMENT_VIEW_ROUTE);

}
