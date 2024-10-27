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
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatStepperModule} from '@angular/material/stepper';
import {inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import {MatOption, MatSelectChange, MatSelectModule} from '@angular/material/select';
import { employeeList, projectListDto, TeamMistakeViewModel, TeamMitakeReportFilter } from '../project.const';
import { HttpService } from '../http.service';
import { FilterModel } from '../../common/generic';
@Component({
  selector: 'app-team-mistake',
  standalone: true,
  imports: [MatPaginatorModule,CommonModule,RouterOutlet,MatTableModule,MatInputModule,MatFormFieldModule,
    MatSortModule,MatCardModule,MatButtonModule,MatIconModule,MatProgressBarModule,RouterLink,
    MatSnackBarModule,MatMenuModule,MatStepperModule,FormsModule,
    ReactiveFormsModule,MatExpansionModule,MatTooltipModule,MatSelectModule],
    providers: [
      {
        provide: STEPPER_GLOBAL_OPTIONS,
        useValue: {showError: true},
      },
    ],
  templateUrl: './team-mistake.component.html',
  styleUrl: './team-mistake.component.scss'
})
export class TeamMistakeComponent implements OnInit {

  private sortingList = new BehaviorSubject<string>("asc");
  fileName= 'mistakes.xlsx';
  totalItems:number=0;

  mistakeFilter:TeamMitakeReportFilter = {filter : {searchQuery:"",pageIndex:0,pageSize:1000,sortActive:'id',
    sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null} ,
    projectsIds:[25],telemarketersIds:[]};

  displayedColumns: string[] = ['projectName','telemarketer','completedQuestionnaire','mistakesCount','mistakesPercentage'];
  dataSource= new MatTableDataSource<TeamMistakeViewModel>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageEvent: PageEvent;
  pageSize:number = 25;
  pageIndex:number;
  advanceFilter:any;
  projectId:number;
  private _formBuilder = inject(FormBuilder);
  firstFormGroup : FormGroup;
  uploadFile:File;
  employeeData:employeeList[];
   selectedItems : any[] = [];
  projectFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:1000,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
  filteredDropdownData: any[] = [];
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSelectedEmployee') private allSelectedEmployee: MatOption;
  currentPage: number = 1;       // Track the current page
  itemsPerPage: number = 25;     // Define how many items to show per page
  totalPage : number = 0;
  totalItemsMistake : number = 0;
  lastSelected : any[];


  constructor( protected projservice:HttpService,
    public dialog: MatDialog,private _snackBar: MatSnackBar,
    ){

      this.firstFormGroup = this._formBuilder.group({
        projectsIds: [[]],
        telemarketersIds :[[]]
      });


    }

  ngOnInit(): void {
    this.getEmployeeList();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getTeamReport(this.mistakeFilter);
    this.loadDropdownData(this.lastSelected);


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
  this.mistakeFilter.projectsIds = this.advanceFilter!=null? this.advanceFilter.projectsIds : null;
  this.mistakeFilter.telemarketersIds = this.advanceFilter!=null? this.advanceFilter.telemarketersIds : null;

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
  this.getTeamReport(this.mistakeFilter);

}
applyFilter(event: Event) {

  const filterValue = (event.target as HTMLInputElement).value;
  this.mistakeFilter.filter.searchQuery=filterValue.trim().toLowerCase();
  this.mistakeFilter.filter.dateFrom = this.advanceFilter!=null? this.advanceFilter.dateFrom:null;
  this.mistakeFilter.filter.dateTo = this.advanceFilter!=null? this.advanceFilter.dateTo:null;
  this.mistakeFilter.filter.createdBy = this.advanceFilter!=null? this.advanceFilter.createdBy:null;
  this.mistakeFilter.filter.typeIds = this.advanceFilter!=null? this.advanceFilter.typeIds:null;
  this.mistakeFilter.projectsIds = this.advanceFilter!=null? this.advanceFilter.projectId : null;
  this.mistakeFilter.telemarketersIds = this.advanceFilter!=null? this.advanceFilter.telemarketersIds : null;

  this.getTeamReport(this.mistakeFilter);
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
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



  readExcelFile(e:any){

    const file =e.target.files[0];
    this.uploadFile=file;
  }

  onSubmit()
  {

      let filter = new TeamMitakeReportFilter();
      filter.projectsIds = this.firstFormGroup.get('projectsIds').value.filter(x => x > 0);
      filter.telemarketersIds = this.firstFormGroup.get('telemarketersIds').value;
      filter.filter = {searchQuery:"",pageIndex:0,pageSize:5,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
     this.projservice.getTeamMistakeReport(filter).subscribe((response)=>{
      this.dataSource.data = response.data;
      this.totalItemsMistake = response.dataSize;
      this.openSnackBar("Fetching  successfully","Close")

     })

  }

  getTeamReport(input : TeamMitakeReportFilter)
  {
    this.mistakeFilter.projectsIds = this.firstFormGroup.get('projectsIds').value;
    this.mistakeFilter.telemarketersIds = this.firstFormGroup.get('telemarketersIds').value;
    this.mistakeFilter.filter = {searchQuery:"",pageIndex:0,pageSize:10,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
    this.projservice.getTeamMistakeReport(this.mistakeFilter).subscribe((response)=>{

      this.dataSource.data = response.data;
      this.totalItemsMistake = response.dataSize;
      this.openSnackBar("Fetching  successfully","Close")

     })
  }

  getEmployeeList()
  {
    this.projservice.getEmployees().subscribe((data)=>
    {
      this.employeeData=data;
    }
    )
  }

//------------------Scrolling------------------------
loadDropdownData(input : any) {

  this.projservice.getProjects(this.projectFilter).subscribe(data => {
    this.filteredDropdownData = data.data;
    this.totalItems = data.dataSize // Initialize filtered data
    this.totalPage = Math.floor(this.totalItems / this.itemsPerPage) + (this.totalItems % this.itemsPerPage > 0 ? 1 : 0);
    this.selectedItems = input

  });
}

onSearch(event: Event): void {

  this.projectFilter.searchQuery = (event.target as HTMLInputElement).value;
  this.loadDropdownData(this.lastSelected);
}

onDropdownOpened(): void {
  this.projectFilter.pageIndex = this.currentPage -1;
  this.loadDropdownData(this.lastSelected);
}


// Next and Previous pagination methods
nextPage() {

  if ((this.currentPage * this.projectFilter.pageSize) < this.totalItems) {
    this.currentPage++;
    this.projectFilter.pageIndex = this.currentPage -1;
    this.loadDropdownData(this.lastSelected);
  }
}

previousPage() {

  if (this.currentPage > 1) {
    this.currentPage--;
    this.projectFilter.pageIndex = this.currentPage -1;

    this.loadDropdownData(this.lastSelected);
  }
}



}
