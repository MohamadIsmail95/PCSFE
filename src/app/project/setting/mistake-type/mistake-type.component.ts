import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {MatTableModule,MatTableDataSource} from '@angular/material/table';
import { HttpService } from '../../http.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MistakTypeViewModel } from '../../project.const';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-mistake-type',
  standalone: true,
  imports: [MatTableModule,MatPaginatorModule,MatSortModule,MatInputModule,
    MatFormFieldModule,MatProgressBarModule,MatCardModule,CommonModule],
  templateUrl: './mistake-type.component.html',
  styleUrl: './mistake-type.component.scss'
})
export class MistakeTypeComponent implements OnInit {
protected httpService = inject(HttpService);
displayedColumns: string[] = ['name', 'weight', 'description'];
dataSource: MatTableDataSource<MistakTypeViewModel>;

@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getMistakeType();
  }


  getMistakeType()
  {
     this.httpService.getMistakeTypeLookup().subscribe((response) =>{
      this.dataSource = new MatTableDataSource<MistakTypeViewModel>(response);
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
