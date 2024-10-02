import { Component, OnInit } from '@angular/core';
import * as xls from 'xlsx'
import { CommonModule, formatDate } from '@angular/common';

//------------------------Modules--------------------------------
import {MatStepperModule} from '@angular/material/stepper';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { HttpService } from '../http.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { employeeList, typeList } from '../project.const';
import { Router, RouterModule, Routes } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NotificationService } from '../notification.service';
import { Unsubscriber } from 'techteec-lib/common';

@Component({
  selector: 'app-create-project',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule,MatStepperModule,MatStepperModule,FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,
  MatButtonModule,MatCardModule,MatDatepickerModule,MatSelectModule,MatTableModule,
  MatSnackBarModule,RouterModule,MatIconModule,MatAutocompleteModule,MatProgressBarModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'

})
export class CreateProjectComponent extends Unsubscriber implements OnInit
 {
  empIds:number[]=[];
  employeeData:employeeList[];
  typeData:typeList[];
  excelData:any=null;
  displayedColumns: string[] = ['GSM','LineType','CallStatus','Generation','Region','City','Segment',
  'SubSegment','Bundle','Contract','AlternativeNumber','Note'];
  dataSource:any;
  isLoad:boolean=false;
  firstFormGroup:FormGroup;
  secondFormGroup:FormGroup;
  thirdFormGroup:FormGroup;
  uploadFile:File;
  response:any;

  constructor(private _formBuilder: FormBuilder,protected projservice:HttpService,
    private _snackBar: MatSnackBar,private router: Router) {
    super();
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      quota: ['', Validators.required],
      TypeId :['',Validators.required]

    },
    { validators: this.ConfirmedValidator('dateFrom','dateTo') }
    );
    this.secondFormGroup = this._formBuilder.group({
      file: ['',Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      employeeIDS: ['', Validators.required],
    });


  }
  ngOnInit(): void {
    this.getEmployeeList();
    this.getProjectType();

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

  readExcelFile(e:any){

    const file =e.target.files[0];
    this.uploadFile=file;
    // let fr =new FileReader();

    // fr.readAsArrayBuffer(file);

    // fr.onload =()=>{

    //  let data=  fr.result;
    //   let workbook= xls.read(data,{type:'array'});

    //         const sheetname= workbook.SheetNames[0];
    //         const sheet1 = workbook.Sheets[sheetname]
    //         this.excelData=xls.utils.sheet_to_json(sheet1,{raw:true});
    //         //-------------------Get Header----------------------
    //          // extract header from excel
    //     const headers: string[] = [];
    //     const columnCount = xls.utils.decode_range(sheet1['!ref'] || '').e.c + 1; // get col count !ref is range A1:G1
    //     for (let i = 0; i < columnCount; ++i) {
    //       headers[i] = sheet1[`${xls.utils.encode_col(i)}1`].v;
    //     }

    //         if(!this.uploadExcelValidation(headers))
    //         {
    //           this.openSnackBar("Excel file has invalid column","Close")

    //         }
    //         else
    //         {
    //           this.dataSource= new MatTableDataSource(this.excelData);;
    //           this.isLoad=true;
    //         }



    //}


  }
   createProject()
   {
    var formData: any = new FormData();
    formData.append('name',this.firstFormGroup.get("name").value);
    formData.append('dateFrom', formatDate(this.firstFormGroup.get("dateFrom").value,'yyyy/MM/dd', "en-US"));
    formData.append('dateTo', formatDate(this.firstFormGroup.get("dateTo").value,'yyyy/MM/dd', "en-US"));
    formData.append('quota', this.firstFormGroup.get("quota").value);
    formData.append('TypeId', this.firstFormGroup.get("TypeId").value);
    formData.append('GSMsFile', this.uploadFile);
    formData.append('employeeIDS',this.thirdFormGroup.get("employeeIDS").value.toString());
     this._otherSubscription = this.projservice.createProject(formData).subscribe((data)=>{
      this.openSnackBar("Created successfully","Close")
      this.router.navigate(['/projects']);
     },(error)=>{
      this.openSnackBar(error.error.message,'Close')

     }


     )
   }

   openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }


  getEmployeeList()
  {
    this.projservice.getEmployees().subscribe((data)=>
    {
      this.employeeData=data;
    }
    )
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  uploadExcelValidation(data:any):boolean
  {

    if( data.includes('GSM') && data.includes('LineType') && data.includes('CallStatus')
       && data.includes('Generation') && data.includes('Region') && data.includes('City')
       && data.includes('Segment') && data.includes('SubSegment') && data.includes('Bundle')
       && data.includes('Contract') && data.includes('AlternativeNumber') && data.includes('Note'))
       {
           return true;
       }
       return false;

  }

  getProjectType()
  {
    this.projservice.getTypes().subscribe((res)=>{
      this.typeData=res;
    })
  }


}
