import {AfterViewInit,Component,Input,OnChanges,OnInit,SimpleChanges} from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-number-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './number-counter.component.html',
  styleUrl: './number-counter.component.scss'
})
export class NumberCounterComponent implements OnInit, OnChanges, AfterViewInit
 {
  @Input("number") number!: number;   // Use number instead of string
  @Input("label") label!: string;
  @Input("duration") duration!: number;  // Use number instead of string
  @Input("total") total!: number;  // Use number instead of string

  counter = new BehaviorSubject<number>(0); // Initialize the counter with 0 as a float

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['duration'] && changes['number']) {
      console.log("Changes happening");
      this.counterFunc();
    }
  }

  ngAfterViewInit() {}

  counterFunc() {
    let start = 0;
    let end = parseFloat(this.number.toFixed(2)); // Ensure the target number is a float

    if (start === end) {
      return;
    }

    // find duration per increment
    let totalMilSecDur = this.duration * 1000; // Convert duration to milliseconds
    let incrementTime = totalMilSecDur / end;  // Calculate time between increments

    let incrementValue = end / (totalMilSecDur / incrementTime);  // Calculate how much to increment per step

    let timer = setInterval(() => {
      start += incrementValue;
      this.counter.next(parseFloat(start.toFixed(2)));  // Update counter as a float with 2 decimal places

      if (start >= end) {
        this.counter.next(end);  // Ensure counter stops exactly at the end value
        clearInterval(timer);
      }
    }, incrementTime);
  }
}
