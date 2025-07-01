import { ChangeDetectorRef, Component, ComponentRef, HostListener, inject, input } from '@angular/core';

import { AnnotationsService } from '@annotations/services/annotations.service';

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
export class AnnotationComponent {

  public top = input.required<number>();

  public left = input.required<number>();

  public transform = input.required<string>();

  public width = input.required<string>();

  public height = input.required<string>();

  public stateClass = input.required<string>();

  public componentRef = input.required<ComponentRef<AnnotationComponent>>();

  protected content: string | null = null;

  private readonly _annotationsService = inject(AnnotationsService);

  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  private _startMovingLayerY = 0;

  private _startMovingLayerX = 0;

  private _startedMovingMatrix: DOMMatrixReadOnly | null = null;

  protected delete(): void {
    this._annotationsService.delete(this.componentRef());
  }

  protected saveText(event: Event): void {
    this.content = (event.target as HTMLInputElement).value;

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
