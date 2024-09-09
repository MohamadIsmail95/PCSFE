import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SegmantViewModel } from '../../project.const';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { provideRouter, Route, RouterLink } from '@angular/router';

@Component({
  selector: 'app-segmant',
  standalone: true,
  imports: [MatTableModule,MatPaginatorModule,MatSortModule,MatFormFieldModule,MatInputModule,MatCardModule,
    MatIconModule,MatButtonModule,CommonModule,RouterLink
  ],
  templateUrl: './segmant.component.html',
  styleUrl: './segmant.component.scss'
})
export class SegmantComponent  implements AfterViewInit{

  segmants : SegmantViewModel[] = []
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<SegmantViewModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

constructor(){
  this.dataSource = new MatTableDataSource(this.segmants);

}


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


