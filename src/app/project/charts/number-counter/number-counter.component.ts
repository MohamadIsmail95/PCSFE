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
  @Input("number") number!: string;
  @Input("label") label!: string;
  @Input("duration") duration!: string;
  @Input("total") total!: string;

  counter = new BehaviorSubject<string>("0");
  constructor() {}
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['duration'] && changes['duration']) {
      console.log("Changes happening");
      this.counterFunc();
    }
  }
  ngAfterViewInit() {}
  counterFunc() {
    let start = 0;
    let end = parseInt(String(this.number).substring(0, 3));

    if (start === end) {
      return;
    }

    // find duration per increment
    let totalMilSecDur = parseInt(this.duration);
    let incrementTime = (totalMilSecDur / end) * 1000;

    let timer = setInterval(() => {
      start += 1;
      this.counter.next(String(start) + this.number.toString().substring(3));
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);
  }


}
