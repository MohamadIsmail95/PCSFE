import { Component, Input, NgModule, OnInit } from '@angular/core';
import { ToasterService } from './ToasterService';
import { Toast } from './Toaster.const';
import{ToasterComponent} from './ToasterComponent';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-toaster-container',
  standalone: true,
  imports:[CommonModule,ToasterComponent],
  template: `
    <app-toaster *ngFor="let toast of toasts; let i=index"
      [toast]="toast" [i]="i"
      (remove)="remove($event)">
    </app-toaster>

  `,
  styles: []
})
export class ToasterContainerComponent implements OnInit {

  toasts: Toast[] = [];

  constructor(protected toaster: ToasterService) {}

  ngOnInit() {
    this.toaster.toast$
      .subscribe(toast => {
        this.toasts = [toast, ...this.toasts];
        setTimeout(() => this.toasts.pop(), toast.delay || 6000);
      });
  }

  remove(index: number) {
    this.toasts = this.toasts.filter((v, i) => i !== index);
    //this.toasts.splice(index, 1);
  }
}
