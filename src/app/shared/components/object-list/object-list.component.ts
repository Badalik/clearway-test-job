import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-object-list',
  imports: [],
  templateUrl: './object-list.component.html',
  styleUrl: './object-list.component.scss',
})
export class ObjectListComponent {
  public readonly list = input.required<{ [key: string]: string | number }>({});

  protected readonly listComputed =  computed(() => Object.entries(this.list()));
}
