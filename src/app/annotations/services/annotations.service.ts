import { ApplicationRef, ComponentRef, createComponent, inject, Injectable } from '@angular/core';

import { AnnotationComponent } from '@annotations/components/annotation';

@Injectable({
  providedIn: 'root',
})
export class AnnotationsService {

  private _appRef = inject(ApplicationRef);

  public static addSizeByMouseEvent(
    event: MouseEvent,
    componentRef: ComponentRef<AnnotationComponent>,
    scrollTop = 0,
    scrollLeft = 0,
  ): void {
    const element = componentRef.location.nativeElement;
    const top = componentRef.instance.top();
    const left = componentRef.instance.left();
    const newTop = event.layerY + scrollTop;
    const newLeft = event.layerX + scrollLeft;
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

    const element = componentRef.location.nativeElement;
    const topInput = top + scrollTop;
    const leftInput = left + scrollLeft;
    const styleTransform = `translateY(${topInput}px) translateX(${leftInput}px)`;
    const styleWidth = `${0}px`;
    const styleHeight = `${0}px`;

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
  }

}
