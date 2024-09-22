import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-segment-evaluation',
  standalone: true,
  imports: [MatGridListModule,MatCardModule,MatFormFieldModule,MatInputModule,MatProgressBarModule,
    MatSelectModule,MatButtonModule,MatTableModule
  ],
  templateUrl: './segment-evaluation.component.html',
  styleUrl: './segment-evaluation.component.scss'
})
export class SegmentEvaluationComponent {

}
