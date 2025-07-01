import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy } from '@angular/core';

import { DocumentControlsService } from '@documents/services/document-controls.service';

import { DOCUMENT_PAGES_TOKEN, DOCUMENT_TOKEN, DOCUMENT_VIEW_PAGE_PROVIDERS } from './document-view-page.providers';
import { DocumentViewComponent } from '../../components/document-view';

@Component({
  selector: 'app-document-view-page',
  imports: [DocumentViewComponent, AsyncPipe],
  providers: DOCUMENT_VIEW_PAGE_PROVIDERS,
  templateUrl: './document-view-page.component.html',
  styleUrl: './document-view-page.component.scss',
})
export class DocumentViewPageComponent implements OnDestroy {

  public elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  protected readonly document$ = inject(DOCUMENT_TOKEN);

  protected readonly documentPages = inject(DOCUMENT_PAGES_TOKEN);

  private readonly _documentControlsService = inject(DocumentControlsService);

  public ngOnDestroy(): void {
    this._documentControlsService.setCurrentDocument(null);
  }

}
