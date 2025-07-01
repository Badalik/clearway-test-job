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
    const top = parseInt(componentRef.instance.top());
    const left = parseInt(componentRef.instance.left());
    const newTop = event.layerY + scrollTop;
    const newLeft = event.layerX + scrollLeft;
    let transformY = 'translateY(0)';
    let transformX = 'translateX(0)';
    let width: number;
    let height: number;

    if (newLeft > left) {
      width = newLeft - left;
    } else {
      width = left - newLeft;
      transformX = `translateX(${newLeft - left}px)`;
    }

    if (newTop > top) {
      height = newTop - top;
    } else {
      height = top - newTop;
      transformY = `translateY(${newTop - top}px)`;
    }

    const styleWidth = `${width}px`;
    const styleHeight = `${height}px`;
    const styleTransform = `${transformY} ${transformX}`;

    element.style.transform = styleTransform;
    componentRef.setInput('transform', styleTransform);
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
    const styleTop = `${top + scrollTop}px`;
    const styleLeft = `${left + scrollLeft}px`;
    const styleTransform = `translateY(${top + scrollTop}px) translateX(${left + scrollLeft}px)`;
    const styleWidth = `${0}px`;
    const styleHeight = `${0}px`;

    componentRef.setInput('top', styleTop);
    componentRef.setInput('left', styleLeft);
    // componentRef.setInput('transform', styleTransform);
    componentRef.setInput('transform', 'translateY(0) translateX(0)');
    componentRef.setInput('width', styleWidth);
    componentRef.setInput('height', styleHeight);
    componentRef.setInput('stateClass', 'state_editing');

    element.style.top = styleTop;
    element.style.left = styleLeft;
    // element.style.transform = styleTransform;
    element.style.transform = 'translateY(0) translateX(0)';
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
