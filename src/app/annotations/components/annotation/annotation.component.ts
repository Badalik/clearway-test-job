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

  public startMovingLayerY = 0;

  public startMovingLayerX = 0;

  public startedMovingMatrix: DOMMatrixReadOnly | null = null;

  protected content: string | null = null;

  private readonly _annotationsService = inject(AnnotationsService);

  private readonly _documentControlsService = inject(DocumentControlsService);

  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  private _ratio = computed(() => parseInt(this.height()) / parseInt(this.width()));

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
    this._annotationsService.deleteAnnotationContent(this.id());
  }

  protected saveText(event: Event): void {
    this.content = (event.target as HTMLInputElement).value;
    this._annotationsService.addAnnotationContent(this.id(), this.content);

    this._changeDetectorRef.detectChanges();
  }

  @HostListener('mousedown', ['$event'])
  private _onMousedown(event: MouseEvent) {
    event.stopPropagation();

    const transform = this.componentRef().location.nativeElement.style.transform;
    this.startMovingLayerY = event.layerY;
    this.startMovingLayerX = event.layerX;
    this.startedMovingMatrix = new DOMMatrixReadOnly(transform);

    this._annotationsService.setMovingComponentRef(this.componentRef());
  }

  @HostListener('mouseup')
  private _onMouseup() {
    this.startMovingLayerY = 0;
    this.startMovingLayerX = 0;
    this.startedMovingMatrix = null;

    this._annotationsService.setMovingComponentRef(null);
  }

}
