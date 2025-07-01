import { Component, ComponentRef, inject, input } from '@angular/core';

import { AnnotationsService } from '@annotations/services/annotations.service';

@Component({
  selector: 'app-annotation',
  host: {
    '[style.transform]': 'transform()',
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

  private readonly _annotationsService = inject(AnnotationsService);

  protected delete(): void {
    this._annotationsService.delete(this.componentRef());
  }

}
