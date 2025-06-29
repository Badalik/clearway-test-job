import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { DOCUMENT_PAGES_TOKEN, DOCUMENT_TOKEN, DOCUMENT_VIEW_PAGE_PROVIDERS } from './document-view-page.providers';
import { DocumentViewComponent } from '../../components/document-view';

@Component({
  selector: 'app-document-view-page',
  imports: [DocumentViewComponent, AsyncPipe],
  providers: DOCUMENT_VIEW_PAGE_PROVIDERS,
  templateUrl: './document-view-page.component.html',
  styleUrl: './document-view-page.component.scss',
})
export class DocumentViewPageComponent {

  protected readonly document$ = inject(DOCUMENT_TOKEN);

  protected readonly documentPages = inject(DOCUMENT_PAGES_TOKEN);

}
