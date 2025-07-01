import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  computed,
  HostListener,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { pairwise } from 'rxjs';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AnnotationsService } from '@annotations/services/annotations.service';
import { DocumentControlsService } from '@documents/services/document-controls.service';

@UntilDestroy()
@Component({
  selector: 'app-annotation',
  host: {
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[class]': 'stateClass()',
  },
  imports: [],
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
})
export class AnnotationComponent implements OnInit {

  public id = input.required<string>();

  public top = input.required<number>();

  public left = input.required<number>();

  public width = input.required<string>();

  public height = input.required<string>();

  public stateClass = input.required<string>();

  public componentRef = input.required<ComponentRef<AnnotationComponent>>();

  protected content: string | null = null;

  private readonly _annotationsService = inject(AnnotationsService);

  private readonly _documentControlsService = inject(DocumentControlsService);

  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  private _ratio = computed(() => parseInt(this.height()) / parseInt(this.width()));

  private _startMovingLayerY = 0;

  private _startMovingLayerX = 0;

  private _startedMovingMatrix: DOMMatrixReadOnly | null = null;

  public ngOnInit(): void {
    this._documentControlsService.scale$
      .pipe(
        pairwise(),
        untilDestroyed(this),
      )
      .subscribe((values) => {
        const element = this.componentRef().location.nativeElement;
        const transform = element.style.transform;
        const matrix = new DOMMatrixReadOnly(transform);
        const width = parseInt(element.style.width);
        const ratio = this._ratio();
        const newTranslateY = matrix.m42 / values[0] * values[1];
        const newTranslateX = matrix.m41 / values[0] * values[1];
        const newWidth = width / values[0] * values[1];

        element.style.transform = `translateY(${newTranslateY}px) translateX(${newTranslateX}px)`;
        element.style.width = `${newWidth}px`;
        element.style.height = `${newWidth * ratio}px`;
      });
  }

  protected delete(): void {
    this._annotationsService.delete(this.componentRef());
    this._annotationsService.deleteAnnotation(this.id());
  }

  protected saveText(event: Event): void {
    this.content = (event.target as HTMLInputElement).value;
    this._annotationsService.addAnnotation(this.id(), this.content);

    this._changeDetectorRef.detectChanges();
  }

  @HostListener('mousedown', ['$event'])
  private _onMousedown(event: MouseEvent) {
    event.stopPropagation();

    const transform = this.componentRef().location.nativeElement.style.transform;
    this._startMovingLayerY = event.layerY;
    this._startMovingLayerX = event.layerX;
    this._startedMovingMatrix = new DOMMatrixReadOnly(transform);
  }

  @HostListener('mouseup')
  private _onMouseup() {
    this._startMovingLayerY = 0;
    this._startMovingLayerX = 0;
    this._startedMovingMatrix = null;
  }

  @HostListener('mousemove', ['$event'])
  private _onMousemove(event: MouseEvent) {
    if (this._startedMovingMatrix !== null) {
      const translateY = this._startedMovingMatrix.m42 - (this._startMovingLayerY - event.layerY);
      const translateX = this._startedMovingMatrix.m41 - (this._startMovingLayerX - event.layerX);
      const element = this.componentRef().location.nativeElement;

      element.style.transform = `translateY(${translateY}px) translateX(${translateX}px)`;
    }
  }

}
