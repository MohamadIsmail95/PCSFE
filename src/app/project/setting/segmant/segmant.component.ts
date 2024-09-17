import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { provideRouter, Route, RouterLink } from '@angular/router';
import { HttpService } from '../../http.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-segmant',
  standalone: true,
  imports: [MatTableModule,MatPaginatorModule,MatSortModule,MatFormFieldModule,MatInputModule,MatCardModule,
    MatIconModule,MatButtonModule,CommonModule,RouterLink,MatProgressBarModule
  ],
  templateUrl: './segmant.component.html',
  styleUrl: './segmant.component.scss'
})
export class SegmantComponent  implements OnInit{

  segmants : string[] = []
  displayedColumns: string[] = ['name'];
  dataSource= new MatTableDataSource<string>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  excelData : string[] = [];
constructor(protected projectService : HttpService)
{

}
  ngOnInit(): void {



    this.getSegmants();

  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data, filter) => data.indexOf(filter) != -1;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 getSegmants()
 {
    this.projectService.getSegmants().subscribe((response)=>{
      this.segmants = response;
      this.dataSource = new MatTableDataSource(this.segmants);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })
 }

 exportexcel(): void
 {

   this.projectService.getSegmants().subscribe((res)=>{
     this.excelData = res
     // Convert array of strings into a 2D array, where each element is in its own row
     const formattedData =  this.excelData.map(item => [item]);

     // Create a worksheet from the 2D array
     const worksheet = XLSX.utils.aoa_to_sheet(formattedData);

     // Create a new workbook and append the worksheet
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

     // Export the workbook to an Excel file
     XLSX.writeFile(workbook, 'Segments.xlsx');
   })





 }

}


