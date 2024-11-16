import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'], // Corrected to "styleUrls"
})
export class BarComponent implements OnInit, OnChanges {
  protected chart = new BehaviorSubject<Chart | null>(null);

  @Input() xLineData: string[] = []; // Ensure default value
  @Input() yLineData: number[] = []; // Ensure default value
  @Input() chartId: string = 'BarChart'; // Default ID if none is passed

  private barChart: Chart | null = null;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['xLineData'] || changes['yLineData']) {
      this.initializeChart();
    }
  }

  ngOnInit(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    const canvas = document.getElementById(this.chartId) as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');

    if (!ctx) {
      console.error('Canvas context not found');
      return;
    }

    // Destroy existing chart instance if it exists
    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.xLineData, // X-axis labels
        datasets: [{
          label: 'Telemarketers',
          data: this.yLineData,
          backgroundColor: this.generateColorRange(),
          borderColor: this.generateColorRange(),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true, // Show legend for each dataset
            position: 'top',
          },
        },
      },
    });

    this.chart.next(this.barChart);

  }

  private generateColorRange(): string[] {
    const colors: string[] = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(199, 199, 199, 0.2)',
      'rgba(83, 102, 255, 0.2)',
      'rgba(140, 159, 86, 0.2)',
      'rgba(215, 192, 128, 0.2)',
      'rgba(100, 140, 200, 0.2)',
      'rgba(255, 140, 100, 0.2)',
      'rgba(175, 75, 200, 0.2)',
      'rgba(220, 20, 60, 0.2)',
      'rgba(34, 139, 34, 0.2)',
      'rgba(30, 144, 255, 0.2)',
      'rgba(218, 112, 214, 0.2)',
      'rgba(50, 205, 50, 0.2)',
      'rgba(244, 164, 96, 0.2)',
      'rgba(127, 255, 212, 0.2)',
      'rgba(255, 20, 147, 0.2)',
      'rgba(70, 130, 180, 0.2)',
      'rgba(240, 128, 128, 0.2)',
      'rgba(135, 206, 250, 0.2)',
      'rgba(255, 165, 0, 0.2)',
      'rgba(128, 0, 128, 0.2)',
      'rgba(173, 255, 47, 0.2)',
      'rgba(205, 92, 92, 0.2)',
      'rgba(46, 139, 87, 0.2)',
      'rgba(123, 104, 238, 0.2)',
    ];

    return colors;
  }


}
