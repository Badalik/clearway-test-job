import { ApplicationRef, ComponentRef, createComponent, inject, Injectable, RendererFactory2 } from '@angular/core';

import { AnnotationComponent } from '@annotations/components/annotation';
import { AnnotationStateName } from '@annotations/enums';

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

  private _mouseupUnlistener?: () => void;

  private _mouseoutUnlistener?: () => void;

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

    // Если это первая аннотация, то создаем единственные слушатель движения мышью, mouseup и выхода за границы родителя
    if (!this._idIncrement) {
      this._addListeners();
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
    componentRef.setInput('stateClass', AnnotationStateName.RESIZING);

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

    if (!this._idIncrement) {
      if (typeof this._mousemoveUnlistener !== 'undefined') {
        this._mousemoveUnlistener();
      }

      if (typeof this._mouseupUnlistener !== 'undefined') {
        this._mouseupUnlistener();
      }
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

  private _addListeners(): void {
    this._mousemoveUnlistener = this._renderer.listen(document.body, 'mousemove', (event) => {
      if (this._movingComponentRef !== null) {
        const instance = this._movingComponentRef.instance;
        const element = this._movingComponentRef.location.nativeElement;
        const parentElement: HTMLElement | null = element.parentNode;

        if (instance.startedMovingMatrix !== null && parentElement !== null) {
          const width = parseInt(element.style.width);
          const height = parseInt(element.style.height);
          const parentWidth = parseInt(parentElement.style.width);
          const parentHeight = parseInt(parentElement.style.height);

          let translateY = instance.startedMovingMatrix.m42 - (instance.startMouseMovingLayerY - event.layerY);
          let translateX = instance.startedMovingMatrix.m41 - (instance.startMouseMovingLayerX - event.layerX);

          if (translateY < 0) {
            translateY = 0;
          }

          if (translateY + height > parentHeight) {
            translateY = parentHeight - height;
          }

          if (translateX < 0) {
            translateX = 0;
          }

          if (translateX + width > parentWidth) {
            translateX = parentWidth - width;
          }

          element.style.transform = `translateY(${ translateY }px) translateX(${ translateX }px)`;

          if (instance.stateClass() !== AnnotationStateName.DRAGGABLE) {
            this._movingComponentRef.setInput('stateClass', AnnotationStateName.DRAGGABLE);

            this._movingComponentRef.changeDetectorRef.detectChanges();
          }
        }
      }
    });

    this._mouseupUnlistener = this._renderer.listen(document, 'mouseup', () => {
      this._resetMoving();
    });

    this._mouseoutUnlistener = this._renderer.listen(document, 'mouseout', (event) => {
      if (this._movingComponentRef !== null) {
        const element = this._movingComponentRef.location.nativeElement;
        const parentElement: HTMLElement | null = element.parentNode;

        // не удалять кажущиеся ненужными скобки вокруг event.toElement.isEqualNode(parentElement)!
        if (event.fromElement.isEqualNode(element) && !(event.toElement.isEqualNode(parentElement))) {
          this._resetMoving();
        }
      }
    });
  }

  private _resetMoving(): void {
    if (this._movingComponentRef !== null) {
      const instance = this._movingComponentRef.instance;

      instance.startMouseMovingLayerY = 0;
      instance.startMouseMovingLayerX = 0;
      instance.startedMovingMatrix = null;

      this._movingComponentRef.setInput('stateClass', AnnotationStateName.EDITING);

      this._movingComponentRef.changeDetectorRef.detectChanges();

      this.setMovingComponentRef(null);
    }
  }

}
