import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DocumentControlsService } from '@documents/services/document-controls.service';

@Component({
  selector: 'app-document-view-control',
  imports: [
    AsyncPipe,
  ],
  templateUrl: './document-view-control.component.html',
  styleUrl: './document-view-control.component.scss',
})
export class DocumentViewControlComponent implements OnInit {

  protected minScale!: number;

  protected maxScale!: number;

  protected scale$!: Observable<number>;

  private readonly _documentControlsService = inject(DocumentControlsService);

  public ngOnInit(): void {
    this.scale$ = this._documentControlsService.scale$;
    this.minScale = this._documentControlsService.minScale;
    this.maxScale = this._documentControlsService.maxScale;
  }

  protected downScale(): void {
    this._documentControlsService.downScale();
  }

  protected upScale(): void {
    this._documentControlsService.upScale();
  }

  protected save(): void {
    this._documentControlsService.save();
  }

}
