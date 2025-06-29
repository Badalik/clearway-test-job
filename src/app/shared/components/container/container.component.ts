import { Component, input } from '@angular/core';

@Component({
  selector: 'app-container',
  imports: [],
  host: {
    '[class]': 'mode()',
  },
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
})
export class ContainerComponent {

  public readonly mode = input<'full' | 'center'>('full');

}
