import { HttpService } from '../../http.service';
import { MatPaginatorModule, PageEvent,MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {RouterLink } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
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
import {MatStepperModule} from '@angular/material/stepper';
import {inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-mistak-table',
  standalone: true,
  imports: [MatPaginatorModule,CommonModule,RouterOutlet,MatTableModule,MatInputModule,MatFormFieldModule,
    MatSortModule,MatCardModule,MatButtonModule,MatIconModule,MatProgressBarModule,RouterLink,
    MatSnackBarModule,MatMenuModule,MatStepperModule,FormsModule,ReactiveFormsModule,MatExpansionModule],
   templateUrl: './mistak-table.component.html',
   providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
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
  private _formBuilder = inject(FormBuilder);
  firstFormGroup : FormGroup;

  constructor( protected projservice:HttpService,
    public dialog: MatDialog,private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
     protected notificationService:NotificationService
    ){

      this.firstFormGroup = this._formBuilder.group({
        file: [''],
      });


    }

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

}
applyFilter(event: Event) {

  const filterValue = (event.target as HTMLInputElement).value;
  this.mistakeFilter.searchQuery=filterValue.trim().toLowerCase();
  this.mistakeFilter.dateFrom = this.advanceFilter!=null? this.advanceFilter.dateFrom:null;
  this.mistakeFilter.dateTo = this.advanceFilter!=null? this.advanceFilter.dateTo:null;
  this.mistakeFilter.createdBy = this.advanceFilter!=null? this.advanceFilter.createdBy:null;
  this.mistakeFilter.typeIds = this.advanceFilter!=null? this.advanceFilter.typeIds:null;
  this.mistakeFilter.projectId = this.advanceFilter!=null? this.advanceFilter.projectId : null;

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

  onSubmit()
  {
    console.log(this.firstFormGroup);

  }


}
