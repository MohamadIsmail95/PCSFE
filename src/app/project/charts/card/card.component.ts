import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule,MatIconModule,MatMenuModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() title: string;
  @Input() bgColor: string;
  @Input() titleColor: string;

}
