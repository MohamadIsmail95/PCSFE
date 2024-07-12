import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Toast } from './Toaster.const';

@Component({
  selector: 'app-toaster',
  standalone: true,

  template: `
    <div class="toast toast-{{toast.type}}"
      [style.bottom.px]="i*100">
      <h4 class="toast-heading">{{toast.title}}</h4>
      <p>{{toast.body}}</p>
      <a class="close" (click)="remove.emit(i)">&times;</a>
    </div>
  `,
   styleUrl: './Toaster.component.css'

})
export class ToasterComponent {
  @Input() toast: Toast;
  @Input() i: number;

  @Output() remove = new EventEmitter<number>();
}
