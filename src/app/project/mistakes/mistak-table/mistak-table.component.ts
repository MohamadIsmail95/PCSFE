import { HttpService } from '../../http.service';
import { MatPaginatorModule, PageEvent,MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, input} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { provideRouter, Route, RouterLink } from '@angular/router';
import {MatDialog,MatDialogRef,MatDialogActions,MatDialogClose,MatDialogTitle,MatDialogContent,} from '@angular/material/dialog';
import * as XLSX from 'xlsx';
//-----------------------Modules-----------------------------------
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { mistakeViewModel, projectListDto, typeList } from '../../project.const';
import { FilterModel } from '../../../common/generic';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import { NotificationService } from '../../notification.service';
import { AccountService } from '../../../app-core/services/account.service';
import { DialogMistakeComponent } from '../dialog-mistake/dialog-mistake.component';
import { MistakeFilterDialogComponent } from '../mistake-filter-dialog/mistake-filter-dialog.component';
@Component({
  selector: 'app-mistak-table',
  standalone: true,
  imports: [MatPaginatorModule,CommonModule,RouterOutlet,MatTableModule,MatInputModule,MatFormFieldModule,
    MatSortModule,MatCardModule,MatButtonModule,MatIconModule,MatProgressBarModule,RouterLink,
    MatSnackBarModule,MatMenuModule],
   templateUrl: './mistak-table.component.html',
  styleUrl: './mistak-table.component.scss'
})
export class MistakTableComponent implements OnInit {
  private sortingList = new BehaviorSubject<string>("asc");
  fileName= 'mistakes.xlsx';
  totalItems:number=0;
  mistakeFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:5,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
  excelFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:1000000,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};

  displayedColumns: string[] = ['month','survey','telemarketer','complated','mistakesCount',
  'mistakesPercentage','available','mark'];
  dataSource= new MatTableDataSource<mistakeViewModel>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  excelData:mistakeViewModel[];
  pageEvent: PageEvent;
  pageSize:number;
  pageIndex:number;
  previousPageIndex:number;
  advanceFilter:any;
  projectId:number;
  constructor( protected projservice:HttpService,private router: Router,
    public dialog: MatDialog,private _snackBar: MatSnackBar,
     private changeDetectorRefs: ChangeDetectorRef,
    private accountService:AccountService,private activateRoute: ActivatedRoute,
     protected notificationService:NotificationService
    ){}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.activateRoute.params.subscribe(params => {
      this.projectId = params['id'];  });

  }
  get sortingList$(): Observable<string> {
    return this.sortingList.asObservable();
  }

  getProjects(filter:FilterModel)
  {
    this.dataSource= new MatTableDataSource<mistakeViewModel>([]);
    this.mistakeFilter=filter;
    filter.projectId = this.projectId;
      //  this.projservice.getMistake(filter)
      // .subscribe((response: { data: mistakeViewModel[]; dataSize: number }) => {
      //   this.dataSource.data= response.data;
      //   this.totalItems = response.dataSize;
      //   this.changeDetectorRefs.detectChanges();
      // });
      console.log(filter)
}
handlePageEvent(event: PageEvent){
  this.pageEvent = event;
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  this.mistakeFilter.pageIndex = event.pageIndex;
  this.mistakeFilter.pageSize=event.pageSize;
  this.mistakeFilter.dateFrom = this.advanceFilter!=null? this.advanceFilter.dateFrom :null;
  this.mistakeFilter.dateTo = this.advanceFilter!=null? this.advanceFilter.dateTo :null;
  this.mistakeFilter.createdBy = this.advanceFilter!=null? this.advanceFilter.createdBy :null;
  this.mistakeFilter.typeIds = this.advanceFilter!=null? this.advanceFilter.typeIds : null;
  this.mistakeFilter.projectId = this.advanceFilter!=null? this.advanceFilter.projectId : null;

   //this.getMistake(this.mistakeFilter)
}
applyFilter(event: Event) {

  const filterValue = (event.target as HTMLInputElement).value;
  //this.dataSource.filter = filterValue.trim().toLowerCase();
  this.mistakeFilter.searchQuery=filterValue.trim().toLowerCase();
  this.mistakeFilter.dateFrom = this.advanceFilter!=null? this.advanceFilter.dateFrom:null;
  this.mistakeFilter.dateTo = this.advanceFilter!=null? this.advanceFilter.dateTo:null;
  this.mistakeFilter.createdBy = this.advanceFilter!=null? this.advanceFilter.createdBy:null;
  this.mistakeFilter.typeIds = this.advanceFilter!=null? this.advanceFilter.typeIds:null;
  this.mistakeFilter.projectId = this.advanceFilter!=null? this.advanceFilter.projectId : null;

  //this.getMistake(this.mistakeFilter);
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }





}

openDialog(id:number,enterAnimationDuration: string, exitAnimationDuration: string): void {
  this.dialog.open( MistakeFilterDialogComponent, {data:id,
    width: '500px',
    enterAnimationDuration,
    exitAnimationDuration,
  })

}
exportexcel(): void
  {

    // this.projservice.getExcelProjects(this.excelFilter).subscribe((res)=>{
    //   this.excelData= res.data
    // })
    // this.excelData.forEach((d)=>{
    //   d.dateFrom= new Date(this.datePipe.transform(d.dateFrom, 'yyyy-MM-dd'));
    //   d.dateTo=new Date(this.datePipe.transform(d.dateTo, 'yyyy-MM-dd'));

    //  let convertData= Object.keys(d).filter(objKey =>
    //     (objKey !== 'typeId'  && objKey !== 'isDeleted' && objKey !== 'projectDetails'))
    //     .reduce((newObj, key) =>
    //     {
    //         newObj[key] = d[key];

    //          return newObj;
    //      }, {}

    // );
    // this.convertExcelData.push(convertData)

    // })
    // /* pass here the table id */
    // const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.convertExcelData);
    // /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Projects');

    // /* save to file */
    // XLSX.writeFile(wb, this.fileName);

  }

  sortByheader(keyName:string)
  {
    this.mistakeFilter.sortActive=keyName;
     if(this.sortingList.value==="asc")
     {
       this.mistakeFilter.sortDirection="desc";
     }
     else
     {
      this.mistakeFilter.sortDirection="asc";

     }
     this.sortingList.next(this.mistakeFilter.sortDirection);
     this.getProjects(this.mistakeFilter);

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }


  openFilterDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(DialogMistakeComponent, {data:this.mistakeFilter,
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.advanceFilter=result.filter;
      this.dataSource=result.data;
      this.totalItems = result.counter;
      this.mistakeFilter.dateFrom = result.filter.dateFrom;
      this.mistakeFilter.dateTo = result.filter.dateTo;
      this.mistakeFilter.createdBy = result.filter.createdBy;
      this.mistakeFilter.typeIds = result.filter.typeIds;
    })

  }





}
