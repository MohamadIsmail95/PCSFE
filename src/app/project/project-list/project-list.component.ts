import { HttpService } from '../http.service';
import { MatPaginatorModule, PageEvent,MatPaginator } from '@angular/material/paginator';
import { Router, RouterOutlet } from '@angular/router';
import {AfterViewInit, ChangeDetectorRef, Component, ExperimentalPendingTasks, Input, OnChanges, SimpleChanges, ViewChild, input} from '@angular/core';
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
import { projectListDto, RdayViewModel, typeList } from '../project.const';
import { FilterModel } from '../../common/generic';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { DialogComponent } from '../dialog/dialog.component';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { AccountService } from '../../app-core/services/account.service';
import { NotificationService } from '../notification.service';
import { DistributeDialoComponent } from '../distribute-dialo/distribute-dialo.component';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import { Unsubscriber } from 'techteec-lib/common';


@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [MatPaginatorModule,CommonModule,RouterOutlet,MatTableModule,MatInputModule,MatFormFieldModule,
  MatSortModule,MatCardModule,MatButtonModule,MatIconModule,MatProgressBarModule,RouterLink,
  MatSnackBarModule,MatMenuModule],
    providers:[DatePipe],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent extends Unsubscriber {

  private sortingList = new BehaviorSubject<string>("asc");
  fileName= 'Projects.xlsx';
  totalItems:number=0;
  projectFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:5,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
  excelFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:1000000,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
  displayedColumns: string[] = ['id', 'name', 'dateFrom', 'dateTo','quota','createdBy','type','action'];
  dataSource= new MatTableDataSource<projectListDto>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  excelData:projectListDto[];
  convertExcelData:any[]=[];
  pageEvent: PageEvent;
  pageSize:number;
  pageIndex:number;
  previousPageIndex:number;
  typeData:typeList[];
  isAdmin:boolean;
  advanceFilter:any;
  expectedDays :RdayViewModel;

  constructor( protected projservice:HttpService,private router: Router,
    public dialog: MatDialog,private _snackBar: MatSnackBar,
     private changeDetectorRefs: ChangeDetectorRef,
     private datePipe: DatePipe,private accountService:AccountService,
     protected notificationService:NotificationService
    ){
    super();
  }


  ngOnInit() {
    this.getProjects(this.projectFilter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.IsAdminRole();
  }
  get sortingList$(): Observable<string> {
    return this.sortingList.asObservable();
  }

  getProjects(filter:FilterModel)
  {
    this.dataSource= new MatTableDataSource<projectListDto>([]);
    this.projectFilter=filter;
    this._otherSubscription = this.projservice.getProjects(filter)
      .subscribe((response: { data: projectListDto[]; dataSize: number }) => {
        this.dataSource.data= response.data;
        this.totalItems = response.dataSize;
        this.changeDetectorRefs.detectChanges();
      });
}

handlePageEvent(event: PageEvent){
  this.pageEvent = event;
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  this.projectFilter.pageIndex = event.pageIndex;
  this.projectFilter.pageSize=event.pageSize;
  this.projectFilter.dateFrom = this.advanceFilter!=null? this.advanceFilter.dateFrom :null;
  this.projectFilter.dateTo = this.advanceFilter!=null? this.advanceFilter.dateTo :null;
  this.projectFilter.createdBy = this.advanceFilter!=null? this.advanceFilter.createdBy :null;
  this.projectFilter.typeIds = this.advanceFilter!=null? this.advanceFilter.typeIds : null;

   this.getProjects(this.projectFilter)
}

applyFilter(event: Event) {

  const filterValue = (event.target as HTMLInputElement).value;
  //this.dataSource.filter = filterValue.trim().toLowerCase();
  this.projectFilter.searchQuery=filterValue.trim().toLowerCase();
  this.projectFilter.dateFrom = this.advanceFilter!=null? this.advanceFilter.dateFrom:null;
  this.projectFilter.dateTo = this.advanceFilter!=null? this.advanceFilter.dateTo:null;
  this.projectFilter.createdBy = this.advanceFilter!=null? this.advanceFilter.createdBy:null;
  this.projectFilter.typeIds = this.advanceFilter!=null? this.advanceFilter.typeIds:null;
  this.getProjects(this.projectFilter);
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }

}

openDialog(id:number,enterAnimationDuration: string, exitAnimationDuration: string): void {
  this.dialog.open(DialogComponent, {data:id,
    width: '250px',
    enterAnimationDuration,
    exitAnimationDuration,
  })

}

exportexcel(): void
  {

    this._otherSubscription = this.projservice.getExcelProjects(this.excelFilter).subscribe((res)=>{
      this.excelData= res.data
    })
    this.excelData.forEach((d)=>{
      d.dateFrom= new Date(this.datePipe.transform(d.dateFrom, 'yyyy-MM-dd'));
      d.dateTo=new Date(this.datePipe.transform(d.dateTo, 'yyyy-MM-dd'));

     let convertData= Object.keys(d).filter(objKey =>
        (objKey !== 'typeId'  && objKey !== 'isDeleted' && objKey !== 'projectDetails'))
        .reduce((newObj, key) =>
        {
            newObj[key] = d[key];

             return newObj;
         }, {}

    );
    this.convertExcelData.push(convertData)

    })
    /* pass here the table id */
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.convertExcelData);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projects');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  IsAdminRole()
  {
     this.accountService.authData$.subscribe((data)=>{
      if(data.userInfo.tenantAccesses[0].roleList[0]==='Admin')
        {
          this.isAdmin=true;
        }
        else
        {
          this.isAdmin=false;
        }
     })

  }

  openDistributeDialog(project:any,enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(DistributeDialoComponent, {data:project,
      width: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.openSnackBar('Redistributed project successfully','Closed')
      }

    })
  }

  openFilterDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {data:this.projectFilter,
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.advanceFilter=result.filter;
      this.dataSource=result.data;
      this.totalItems = result.counter;
      this.projectFilter.dateFrom = result.filter.dateFrom;
      this.projectFilter.dateTo = result.filter.dateTo;
      this.projectFilter.createdBy = result.filter.createdBy;
      this.projectFilter.typeIds = result.filter.typeIds;
    })

  }

  expprtToExcelBackend()
  {
    this.projservice.exportProjects().subscribe((blob)=>{

      // Create a link element
       const a = document.createElement('a');
       const objectUrl = URL.createObjectURL(blob);

       // Set the download attribute and href
        a.href = objectUrl;
       a.download = 'Projects.xlsx'; // Replace with the desired file name

    // Trigger the download
     a.click();

    // Clean up the object URL
      URL.revokeObjectURL(objectUrl);

    })
  }

  getRDays(id : number)
  {
     this.projservice.getExpectedRemainingDays(id).subscribe((response)=>{
      this.expectedDays = response;
      let formattedValue = this.expectedDays.remainingDays.toFixed(2); // Returns "7.22" as a string
      let numberValue = parseFloat(formattedValue); // Converts back to a number if needed
      this.openSnackBar('Remaining Days : '+ numberValue,'Closed')
     })
  }
}



