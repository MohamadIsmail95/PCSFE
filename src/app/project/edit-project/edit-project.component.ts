import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { employeeList, projectDetails, projectDetailsList, typeList } from '../project.const';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormArray} from '@angular/forms';
//----------------------------------------------------
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDialog,MAT_DIALOG_DATA, MatDialogRef,MatDialogTitle,MatDialogContent,MatDialogActions, MatDialogClose,} from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatPaginator,MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort,MatSortModule } from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import * as XLSX from 'xlsx';
import { AccountService } from '../../app-core/services/account.service';
import { FilterModel } from '../../common/generic';
import { Unsubscriber } from 'techteec-lib/common';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule,MatButtonModule,MatInputModule,MatFormFieldModule,MatDatepickerModule,MatSelectModule,
    MatTableModule,MatSnackBarModule,ReactiveFormsModule,FormsModule,MatStepperModule,
    MatProgressBarModule,CommonModule,MatRippleModule,MatDialogModule,MatPaginatorModule, MatSortModule,MatIconModule
    ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent  implements OnInit {

  projectFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:5,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
  excelFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:1000000,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
  pageEvent: PageEvent;
  pageSize:number;
  pageIndex:number;
  previousPageIndex:number;
  private sortingList = new BehaviorSubject<string>("asc");
  totalItems:number=0;

  //---------------------------------------------------------
  empId: number;
  empDetails:projectDetailsList;
  firstFormGroup:FormGroup;
  employeeData:employeeList[];
  typeData:typeList[];
  statusData:typeList[];
  isLoad:boolean=false;
  displayedColumns: string[] = ['gsm','employeeUserName','callStatus','lineType','generation',
  'region','city','segment','subSegment','bundle','contract','alternativeNumber','note'];
  dataSource= new MatTableDataSource<projectDetails>([]);
  ConvertedData:projectDetails[];
  newDataSource:projectDetails[]=[];
  private currentEmp = new BehaviorSubject<projectDetails[]>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  convertExcelData:any[]=[];
  isAdmin:boolean;

  constructor(private _formBuilder: FormBuilder,private route: ActivatedRoute,
    protected projectService:HttpService,private _snackBar: MatSnackBar,public dialog: MatDialog,
    private router: Router,private accountService:AccountService ,private changeDetectorRefs: ChangeDetectorRef)
    {
  }

  ngOnInit(): void
   {
    this.route.params.subscribe(params => {
      this.empId = params['id'];
    });

    this.getEmployeeList();
    this.getById(this.projectFilter);
    this.getStataus();
    this.getProjectType();
    this.IsAdminRole();
    this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
  }

  get sortingList$(): Observable<string> {
    return this.sortingList.asObservable();
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const dateF = formGroup.controls[controlName];
      const dateT = formGroup.controls[matchingControlName];
      if(dateF.value > dateT.value)
      {
        dateT.setErrors({ confirmedValidator: true });

      }
  }

  }


  get items() {
    return this.firstFormGroup.get('projectDetails') as FormArray;
  }

  addItem(dataArr:projectDetails[]) {

    dataArr.forEach(element => {
      let elm= this._formBuilder.group({
        // Define your form controls here
        id:[element.id],
        gsm:[element.gsm],
        note:[element.note],
        employeeID:[element.employeeID],
        employeeUserName:[element.employeeUserName],
        lineTypeId:[element.lineTypeId],
        callStatusId:[element.callStatusId],
        generationId:[element.generationId],
        regionId:[element.regionId],
        cityId:[element.cityId],
        segment:[element.segment],
        subSegment:[element.subSegment],
        bundle:[element.bundle],
        contract:[element.contract],
        alternativeNumber:[element.alternativeNumber],
        lineType:[element.lineType],
        callStatus:[element.callStatus],
        generation:[element.generation],
        region:[element.region],
        city:[element.city],


      });
      this.items.push(elm);

    }

    );


    // Add the new form group to the FormArray
  }

  onSubmit()
  {
    this.addItem(this.newDataSource);
    this.projectService.update(this.firstFormGroup.value).subscribe((data)=>{
      this.router.navigate(['/projects']);
    },(error)=>{
      this.openSnackBar(error.error.message,'Close')

     })

  }

  getEmployeeList()
  {
   this.projectService.getEmployees().subscribe((data)=>
    {
      this.employeeData=data;
    }
    )
  }



  openDialog(row:any): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {details:row,employeelis:this.employeeData,status:this.statusData}, height: '300px',
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
       let index = this.newDataSource.findIndex(x => x.id === result.details.id);
       if(index===-1)
       {
        this.newDataSource.push(result.details)

       }
       else
       {

        this.newDataSource.splice(index,1)
        this.newDataSource.push(result.details)

       }


    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }



  getById(filter:FilterModel)
  {
    this.projectService.getById(this.empId ,filter).subscribe((response: { data: projectDetailsList; dataSize: number })=>{
      this.empDetails = response.data;
      this.dataSource = new MatTableDataSource( this.empDetails.projectDetails);
      this.currentEmp.next(this.empDetails.projectDetails);
      this.totalItems = response.dataSize;
      this.changeDetectorRefs.detectChanges();

      this.firstFormGroup = this._formBuilder.group({
        id:[this.empDetails.id,Validators.required],
        name: [this.empDetails.name,Validators.required],
        dateFrom: [this.empDetails.dateFrom, Validators.required],
        dateTo: [this.empDetails.dateTo, Validators.required],
        quota: [this.empDetails.quota, Validators.required],
        typeId: [this.empDetails.typeId, Validators.required],
        projectDetails: this._formBuilder.array([])
      },
      { validators: this.ConfirmedValidator('dateFrom','dateTo')
      }
      );

     this.isLoad=true;
     }
     );

  }
  exportexcel(): void
  {
    this.empDetails.projectDetails.forEach((d)=>{
      let convertData= Object.keys(d).filter(objKey =>
         (objKey !== 'id'  && objKey !== 'lineTypeId' && objKey !== 'callStatusId'
         && objKey !== 'regionId' && objKey !== 'cityId' && objKey !== 'employeeID'  && objKey !== 'generationId'))
         .reduce((newObj, key) =>
         {
             newObj[key] = d[key];

              return newObj;
          }, {}

     );
     this.convertExcelData.push(convertData)

     })
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.convertExcelData);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Distribution');

    /* save to file */
    XLSX.writeFile(wb, 'Distribution.xlsx');

  }

 getStataus()
 {
  this.projectService.getStatus().subscribe((res)=>{
    this.statusData=res
  })
 }

  getProjectType()
  {
   this.projectService.getTypes().subscribe((res)=>{
      this.typeData=res;
    })
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

  handlePageEvent(event: PageEvent){
    this.pageEvent = event;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.projectFilter.pageIndex = event.pageIndex;
    this.projectFilter.pageSize=event.pageSize;

     this.getById(this.projectFilter)
  }
  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.projectFilter.searchQuery=filterValue.trim().toLowerCase();
    this.getById(this.projectFilter);
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
     this.getById(this.projectFilter);

  }





}

