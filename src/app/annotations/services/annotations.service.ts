import { ApplicationRef, ComponentRef, createComponent, inject, Injectable, RendererFactory2 } from '@angular/core';

import { AnnotationComponent } from '@annotations/components/annotation';

@Injectable({
  providedIn: 'root',
})
export class AnnotationsService {

  private _appRef = inject(ApplicationRef);

  private _rendererFactory = inject(RendererFactory2);

  private _renderer = this._rendererFactory.createRenderer(null, null);

  private _idIncrement = 0;

  private _annotations: { [key: string]: string } = {};

  private _movingComponentRef: ComponentRef<AnnotationComponent> | null = null;

  private _mousemoveUnlistener?: () => void;

  public get annotations(): { [key: string]: string } {
    return this._annotations;
  }

  public static addSizeByMouseEvent(
    deltaY: number,
    deltaX: number,
    componentRef: ComponentRef<AnnotationComponent>,
    scrollTop = 0,
    scrollLeft = 0,
  ): void {
    const element = componentRef.location.nativeElement;
    const top = componentRef.instance.top();
    const left = componentRef.instance.left();
    const newTop = deltaY + scrollTop;
    const newLeft = deltaX + scrollLeft;
    let transformY;
    let transformX;
    let width: number;
    let height: number;

    if (newLeft > left) {
      width = newLeft - left;

      transformX = `translateX(${left}px)`;
    } else {
      width = left - newLeft;
      transformX = `translateX(${left - width}px)`;
    }

    if (newTop > top) {
      height = newTop - top;
      transformY = `translateY(${top}px)`;
    } else {
      height = top - newTop;
      transformY = `translateY(${top - height}px)`;
    }

    const styleWidth = `${width}px`;
    const styleHeight = `${height}px`;

    element.style.transform = `${transformY} ${transformX}`;
    element.style.width = styleWidth;
    componentRef.setInput('width', styleWidth);
    element.style.height = styleHeight;
    componentRef.setInput('height', styleHeight);
  }

  public create(
    top: number,
    left: number,
    parentElement = document.body,
    scrollTop = 0,
    scrollLeft = 0,
  ): ComponentRef<AnnotationComponent> {
    const componentRef = createComponent(
      AnnotationComponent,
      {
        environmentInjector: this._appRef.injector,
      },
    );

    if (!this._idIncrement) {
      this._mousemoveUnlistener = this._renderer.listen(document, 'mousemove', (event) => {
        if (this._movingComponentRef !== null) {
          const instance = this._movingComponentRef.instance;
          const element = this._movingComponentRef.location.nativeElement;

          if (instance.startedMovingMatrix !== null) {
            const translateY = instance.startedMovingMatrix.m42 - (instance.startMovingLayerY - event.layerY);
            const translateX = instance.startedMovingMatrix.m41 - (instance.startMovingLayerX - event.layerX);

            element.style.transform = `translateY(${translateY}px) translateX(${translateX}px)`;
          }
        }
      });
    }

    this._idIncrement++;

    const element = componentRef.location.nativeElement;
    const topInput = top + scrollTop;
    const leftInput = left + scrollLeft;
    const styleTransform = `translateY(${topInput}px) translateX(${leftInput}px)`;
    const styleWidth = `${0}px`;
    const styleHeight = `${0}px`;

    componentRef.setInput('id', this._idIncrement.toString());
    componentRef.setInput('top', topInput);
    componentRef.setInput('left', leftInput);
    componentRef.setInput('width', styleWidth);
    componentRef.setInput('height', styleHeight);
    componentRef.setInput('stateClass', 'state_editing');

    element.style.transform = styleTransform;
    element.style.width = styleWidth;
    element.style.height = styleHeight;

    parentElement.appendChild(componentRef.location.nativeElement);

    componentRef.changeDetectorRef.detectChanges();

    return componentRef;
  }

  public delete(componentRef: ComponentRef<AnnotationComponent>): void {
    this._appRef.detachView(componentRef.hostView);

    componentRef.destroy();

    this._idIncrement--;

    if (!this._idIncrement && typeof this._mousemoveUnlistener !== 'undefined') {
      this._mousemoveUnlistener();
    }
  }

  public setMovingComponentRef(componentRef: ComponentRef<AnnotationComponent> | null): void {
    this._movingComponentRef = componentRef;
  }

  public addAnnotationContent(id: string, annotation: string): void {
    this._annotations[id] = annotation;
  }

  public deleteAnnotationContent(id: string): void {
    delete this._annotations[id];
  }

}
