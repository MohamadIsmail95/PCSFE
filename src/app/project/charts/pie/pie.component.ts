import { BaseChartDirective } from 'ng2-charts';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { LocalStorageService } from '../../local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pie',
  standalone: true,
  imports: [BaseChartDirective,CommonModule],
  templateUrl: './pie.component.html',
  styleUrl: './pie.component.scss'
})
export class PieComponent implements OnInit ,OnChanges ,AfterViewInit{
  protected chartPie = new BehaviorSubject<any>(null);
  @Input() xPieLineData :string[];
  @Input() yPieLineData : number[];
  projectDetails:any;

  constructor() {
  }

  ngAfterViewInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['xLineData'] && changes['xLineData']) {

      this.createChart(this.xPieLineData,this.yPieLineData)
    }
    }
  ngOnInit(): void {

    this.createChart(this.xPieLineData,this.yPieLineData)

  }
  createChart(xLineData:string[],yLineData:number[]){
    this.chartPie.next(new Chart("PieChart", {
      type: 'doughnut', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: xLineData,
        datasets: [{
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
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }

    }));
  }


}
