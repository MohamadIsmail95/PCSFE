import { BaseChartDirective } from 'ng2-charts';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [BaseChartDirective,CommonModule],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss'
})
export class BarComponent implements OnInit ,OnChanges ,AfterViewInit {
  projectDetails:any;
  protected chart = new BehaviorSubject<any>(null);
  @Input() xLineData :string[];
  @Input() yLineData : number[];

  constructor() {

  }
  ngAfterViewInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['xLineData'] && changes['yLineData']) {

      this.createChart(this.xLineData,this.yLineData)
    }
  }

  ngOnInit(): void {
    this.createChart(this.xLineData,this.yLineData)

  }
  createChart(xLineData:string[],yLineData:number[]){

    this.chart.next(new Chart("BarChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: xLineData,
	       datasets: [
          {
            label: '', data: yLineData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          },


        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }

    }));
  }





}
