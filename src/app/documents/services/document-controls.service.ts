import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AnnotationsService } from '@annotations/services/annotations.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentControlsService {

  public readonly minScale = 25;

  public readonly maxScale = 500;

  public readonly breakpoints: number[] = [
    this.minScale, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, this.maxScale,
  ];

  public scale$ = new BehaviorSubject<number>(100);

  private readonly _annotationsService = inject(AnnotationsService);

  private _breakpointIndex = 7;

  public downScale(): void {
    const index = this._breakpointIndex - 1;

    if (index >= 0) {
      this._breakpointIndex = index;

      this.scale$.next(this.breakpoints[index]);
    }
  }

  public upScale(): void {
    const index = this._breakpointIndex + 1;

    if (index < this.breakpoints.length) {
      this._breakpointIndex = index;

      this.scale$.next(this.breakpoints[index]);
    }
  }

  public scaleByIndex(index: number): void {
    if (index !== this._breakpointIndex) {
      this._breakpointIndex = index;

      this.scale$.next(this.breakpoints[index]);
    }
  }

  public save(): void {
    for (const value of Object.values(this._annotationsService.annotations)) {
      console.log(value);
    }
  }

}
