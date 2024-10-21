import { HttpService } from '../../http.service';
import { MatPaginatorModule, PageEvent,MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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
import { LookupViewModel, MistakeReportResponse, mistakeViewModel, MitakeReportFilter } from '../../project.const';
import { FilterModel } from '../../../common/generic';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import { NotificationService } from '../../notification.service';
import { DialogMistakeComponent } from '../dialog-mistake/dialog-mistake.component';
import { MistakeFilterDialogComponent } from '../mistake-filter-dialog/mistake-filter-dialog.component';
import {MatStepperModule} from '@angular/material/stepper';
import {inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-mistak-table',
  standalone: true,
  imports: [MatPaginatorModule,CommonModule,RouterOutlet,MatTableModule,MatInputModule,MatFormFieldModule,
    MatSortModule,MatCardModule,MatButtonModule,MatIconModule,MatProgressBarModule,RouterLink,
    MatSnackBarModule,MatMenuModule,MatStepperModule,FormsModule,
    ReactiveFormsModule,MatExpansionModule,MatTooltipModule,MatSelectModule],
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

  mistakeFilter:MitakeReportFilter={filter : {searchQuery:"",pageIndex:0,pageSize:5,sortActive:'id',
    sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null} ,
    projectId:0,telemarketerIds:[],mistakeTypes:[]};

  displayedColumns: string[] = ['projectName','telemarketerName','mistakeType','gsm','serial',
  'questionNumber','segment','mistakeDescription','mistakeWeight','controller'];
  dataSource= new MatTableDataSource<MistakeReportResponse>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageEvent: PageEvent;
  pageSize:number;
  pageIndex:number;
  previousPageIndex:number;
  advanceFilter:any;
  projectId:number;
  private _formBuilder = inject(FormBuilder);
  firstFormGroup : FormGroup;
  uploadFile:File;


  constructor( protected projservice:HttpService,
    public dialog: MatDialog,private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
     protected notificationService:NotificationService,
     private changeDetectorRefs: ChangeDetectorRef
    ){

      this.activateRoute.params.subscribe(params => {
        this.projectId = params['id'];  });


      this.firstFormGroup = this._formBuilder.group({
        ProjectId: [this.projectId , Validators.required],
        MistakeReport :['',Validators.required]
      });


    }

  ngOnInit(): void {
    this.getMistakeReportById(this.mistakeFilter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  get sortingList$(): Observable<string> {
    return this.sortingList.asObservable();
  }


handlePageEvent(event: PageEvent){
  this.pageEvent = event;
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  this.mistakeFilter.filter.pageIndex = event.pageIndex;
  this.mistakeFilter.filter.pageSize=event.pageSize;
  this.mistakeFilter.filter.dateFrom = this.advanceFilter!=null? this.advanceFilter.dateFrom :null;
  this.mistakeFilter.filter.dateTo = this.advanceFilter!=null? this.advanceFilter.dateTo :null;
  this.mistakeFilter.filter.createdBy = this.advanceFilter!=null? this.advanceFilter.createdBy :null;
  this.mistakeFilter.filter.typeIds = this.advanceFilter!=null? this.advanceFilter.typeIds : null;
  this.mistakeFilter.projectId = this.advanceFilter!=null? this.advanceFilter.projectId : null;
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
  this.getMistakeReportById(this.mistakeFilter);

}
applyFilter(event: Event) {

  const filterValue = (event.target as HTMLInputElement).value;
  this.mistakeFilter.filter.searchQuery=filterValue.trim().toLowerCase();
  this.mistakeFilter.filter.dateFrom = this.advanceFilter!=null? this.advanceFilter.dateFrom:null;
  this.mistakeFilter.filter.dateTo = this.advanceFilter!=null? this.advanceFilter.dateTo:null;
  this.mistakeFilter.filter.createdBy = this.advanceFilter!=null? this.advanceFilter.createdBy:null;
  this.mistakeFilter.filter.typeIds = this.advanceFilter!=null? this.advanceFilter.typeIds:null;
  this.mistakeFilter.projectId = this.advanceFilter!=null? this.advanceFilter.projectId : null;
  this.getMistakeReportById(this.mistakeFilter);
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
    this.mistakeFilter.filter.sortActive=keyName;
     if(this.sortingList.value==="asc")
     {
       this.mistakeFilter.filter.sortDirection="desc";
     }
     else
     {
      this.mistakeFilter.filter.sortDirection="asc";

     }
     this.sortingList.next(this.mistakeFilter.filter.sortDirection);

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
      this.changeDetectorRefs.detectChanges();

      this.advanceFilter=result.filter;
      this.dataSource.data=result.data;
      this.totalItems = result.counter;

      this.mistakeFilter.projectId = result.filter.projectId;
      this.mistakeFilter.mistakeTypes = result.filter.mistakeTypes;
      this.mistakeFilter.telemarketerIds = result.filter.telemarketerIds;
      this.mistakeFilter.filter = result.filter.filter;



    })

  }

  readExcelFile(e:any){

    const file =e.target.files[0];
    this.uploadFile=file;
  }

  onSubmit()
  {
    var formData: any = new FormData();
    formData.append('ProjectId', this.firstFormGroup.get("ProjectId").value);
    formData.append('MistakeReport', this.uploadFile);

     this.projservice.UploadMistakeReport(formData).subscribe((response)=>{
      this.dataSource.data = response.data;
      this.totalItems = response.dataSize;


      this.openSnackBar("Upload successfully","Close")

     })

  }

  getMistakeReportById(input:MitakeReportFilter)
  {
    input.projectId = this.projectId;
    this.projservice.getMistakeReportById(input).subscribe((response) =>
    {
      this.dataSource.data = response.data;

      this.totalItems = response.dataSize;

    })
  }




}
