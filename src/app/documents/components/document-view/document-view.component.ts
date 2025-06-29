import { Component, input } from '@angular/core';

import { DocumentResponse } from '@core/models';

import { DocumentPageViewComponent } from '../document-page-view';

@Component({
  selector: 'app-document-view',
  imports: [
    DocumentPageViewComponent,
  ],
  providers: [],
  templateUrl: './document-view.component.html',
  styleUrl: './document-view.component.scss',
})
export class DocumentViewComponent {

  public readonly document = input.required<DocumentResponse>();

  public readonly documentPages = input.required<Blob[] | null>();

}
