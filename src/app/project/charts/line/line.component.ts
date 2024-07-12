import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { BaseChartDirective } from 'ng2-charts';
import { LocalStorageService } from '../../local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line',
  standalone: true,
  imports: [BaseChartDirective,CommonModule],
  templateUrl: './line.component.html',
  styleUrl: './line.component.scss'
})
export class LineComponent  implements  OnInit ,OnChanges ,AfterViewInit{

  projectDetails:any;
  protected chart = new BehaviorSubject<any>(null);
  @Input() xLineData :string[];
  @Input() yLineData : number[];

   constructor(){}

  ngAfterViewInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['xLineData'] && changes['yLineData']) {

      this.createChart(this.xLineData,this.yLineData)
    }
  }
  ngOnInit(): void {
    this.createChart(this.xLineData,this.yLineData)

  }

  createChart(xLineData:string[],yLineData:number[]){

    this.chart.next( new Chart("lineChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: xLineData,
	       datasets: [
          {
            label: "Quota Progress",
            data: yLineData,
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
                ],          },


        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false

      }

    }));
  }



}
