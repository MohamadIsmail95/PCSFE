import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../http.service';
import { MatPaginatorModule, PageEvent,MatPaginator } from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterModel } from '../../../common/generic';
import { projectListDto } from '../../project.const';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [MatPaginatorModule,MatSortModule,MatTableModule,CommonModule,MatProgressBarModule,
    MatFormFieldModule,MatInputModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements OnInit {
  private sortingList = new BehaviorSubject<string>("asc");
  totalItems:number=0;
  projectFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:10,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
  displayedColumns: string[] = ['id', 'name', 'dateFrom', 'dateTo','quota','createdBy','type'];
  dataSource= new MatTableDataSource<projectListDto>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageEvent: PageEvent;
  pageSize:number;
  pageIndex:number;
  previousPageIndex:number;

  constructor( protected projservice:HttpService){}


  ngOnInit(): void {
    this.getProjects(this.projectFilter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get sortingList$(): Observable<string> {
    return this.sortingList.asObservable();
  }

  getProjects(filter:FilterModel){

    this.projservice.getProjects(filter)
   .subscribe((response: { data: projectListDto[]; dataSize: number }) => {
     this.dataSource.data=response.data;
     this.totalItems = response.dataSize;
   });
}

handlePageEvent(event: PageEvent){
  this.pageEvent = event;
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  this.projectFilter.pageIndex = event.pageIndex;
  this.projectFilter.pageSize=event.pageSize;
   this.getProjects(this.projectFilter)
}

applyFilter(event: Event) {

  const filterValue = (event.target as HTMLInputElement).value;
  //this.dataSource.filter = filterValue.trim().toLowerCase();
  this.projectFilter.searchQuery=filterValue.trim().toLowerCase();

  this.getProjects(this.projectFilter);
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }

}


sortByheader(keyName:string)
{
  this.projectFilter.sortActive=keyName;
   if(this.sortingList.value==="asc")
   {
     this.projectFilter.sortDirection="desc";
   }
   else
   {
    this.projectFilter.sortDirection="asc";

   }
   this.sortingList.next(this.projectFilter.sortDirection);
   this.getProjects(this.projectFilter);

}




}
