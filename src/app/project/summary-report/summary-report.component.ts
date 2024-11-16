import { Component, inject, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MistakeSummaryReport } from '../project.const';
import { HttpService } from '../http.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-summary-report',
  standalone: true,
  imports: [MatProgressBarModule,MatTableModule,MatFormFieldModule, MatInputModule,
     MatTableModule, MatSortModule, MatPaginatorModule,MatCardModule,CommonModule],
  templateUrl: './summary-report.component.html',
  styleUrl: './summary-report.component.scss'
})
export class SummaryReportComponent implements OnInit{
  ngOnInit(): void {
    this.getMistakeSummary();
  }

  displayedColumns: string[] = ['mistakeType', 'count'];
  dataSource: MatTableDataSource<MistakeSummaryReport>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  projectService = inject(HttpService);


  getMistakeSummary()
  {
    this.projectService.getMistakeSummaryReport().subscribe((response)=>{
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

