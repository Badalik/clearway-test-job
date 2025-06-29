import { Component, ElementRef, inject, input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { skip } from 'rxjs';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SCROLLBAR_WIDTH } from '@core/constants/constants';

import { DocumentControlsService } from '@documents/services/document-controls.service';

@UntilDestroy()
@Component({
  selector: 'app-document-page-view',
  imports: [],
  templateUrl: './document-page-view.component.html',
  styleUrl: './document-page-view.component.scss',
})
export class DocumentPageViewComponent implements OnInit {

  public readonly page = input.required<Blob>();

  protected imageSrc!: SafeUrl; // на всякий случай, если нужно будет использовать тег img

  protected backgroundImage!: SafeStyle;

  protected imageWidth!: number;

  protected imageHeight!: number;

  private _hostWidth!: number;

  private _imageRatio = 1;

  private readonly _domSanitizer = inject(DomSanitizer);

  private readonly _documentControlsService = inject(DocumentControlsService);

  private readonly _elementRef = inject(ElementRef);

  private _scale = this._documentControlsService.scale$.getValue();

  public ngOnInit(): void {
    const blob = this.page();
    const objectURL = URL.createObjectURL(blob);
    const hostElement = this._elementRef.nativeElement;

    this._hostWidth = hostElement.clientWidth - SCROLLBAR_WIDTH;
    this.imageSrc = this._domSanitizer.bypassSecurityTrustUrl(objectURL);
    this.backgroundImage = this._domSanitizer.bypassSecurityTrustStyle(`url(${objectURL})`);

    this._getImageSize(objectURL);
  }

  private _getImageSize(objectURL: string) {
    const image = new Image();

    image.src = objectURL;

    image.onload = () => {
      let width = image.width;
      let height = image.height;

      this._imageRatio = height / width;

      if (width > this._hostWidth) {
        const breakpoints = this._documentControlsService.breakpoints;
        const toDownScale = 100 - 100 / width * (width - this._hostWidth);

        const breakpointIndex = breakpoints
          .findIndex((p, i) => {
            const scale = breakpoints[i + 1] ?? p;

            return scale > toDownScale;
          });

        const scale = this._documentControlsService.breakpoints[breakpointIndex];

        this._scale = scale;

        width = width / 100 * scale;
        height = width * this._imageRatio;

        if (scale !== this._documentControlsService.scale$.getValue()) {
          this._documentControlsService.scaleByIndex(breakpointIndex);
        }
      }

      this.imageWidth = width;
      this.imageHeight = height;

      this._scaleSubscribe();
    };
  }

  private _scaleSubscribe(): void {
    this._documentControlsService.scale$
      .pipe(
        skip(1),
        untilDestroyed(this),
      )
      .subscribe((scale) => {
        this.imageWidth = this.imageWidth / this._scale * scale;
        this.imageHeight = this.imageWidth * this._imageRatio;
        this._scale = scale;
      });
  }

}
