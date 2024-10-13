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

    if (start === end || this.duration <= 0 || isNaN(end)) {
      return; // Exit if no increment needed or invalid duration/number
    }

    let totalMilSecDur = this.duration * 1000; // Convert duration to milliseconds
    let incrementTime = totalMilSecDur / (end || 1);  // Avoid division by zero
    let incrementValue = end / (totalMilSecDur / 16.67);  // Approximate 60 FPS updates

    const updateCounter = () => {
      start = Math.min(start + incrementValue, end);  // Increment and ensure not to exceed the end
      this.counter.next(parseFloat(start.toFixed(2)));  // Update the counter with precision

      if (start < end) {
        requestAnimationFrame(updateCounter);  // Continue animation
      } else {
        this.counter.next(end);  // Ensure the counter reaches exactly the end value
      }
    };

    requestAnimationFrame(updateCounter);  // Start the animation
  }

}
