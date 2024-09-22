import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { HttpService } from '../http.service';
import { CommonModule } from '@angular/common';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { employeeList, typeList } from '../project.const';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,MatIconModule,
    MatDialogTitle,MatDatepickerModule,
    MatDialogContent,MatCardModule,
    MatDialogActions,ReactiveFormsModule,
    MatDialogClose,MatSelectModule,CommonModule
  ],
 templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.scss'
})
export class FilterDialogComponent  implements OnInit{

  filterForm:FormGroup;
  adminData:employeeList[];
  typeData:typeList[];

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,protected projectService:HttpService,
    private _formBuilder: FormBuilder)
  {

    this.filterForm = this._formBuilder.group({
      searchQuery:[data.searchQuery],
      pageIndex:[data.pageIndex],
      pageSize:[data.pageSize],
      sortActive:[data.sortActive],
      sortDirection:[data.sortDirection],
      dateFrom:[data.dateFrom!=null?data.dateFrom:null],
      dateTo:[data.dateTo!=null?data.dateTo:null],
      createdBy:[data.createdBy!=null?data.createdBy:null],
      typeIds:[data.typeIds!=null?data.typeIds:null]
    });


  }
  ngOnInit(): void {
    this.getAdminList();
    this.getProjectType();
  }

  onSubmit()
  {
     this.projectService.getProjects(this.filterForm.value).subscribe((res)=>{
      this.dialogRef.close({data:res.data , counter: res.dataSize ,filter:this.filterForm.value});
     })
  }
  getProjectType()
  {
    this.projectService.getTypes().subscribe((res)=>{
      this.typeData=res;
    })
  }

  getAdminList()
  {
    this.projectService.getAdmins().subscribe((data)=>
    {
      this.adminData=data;
    }
    )
  }

   resetFilter()
   {
    this.filterForm.reset();
    this.filterForm.get('pageIndex').setValue(0);
    this.filterForm.get('pageSize').setValue(5);
    this.filterForm.get('sortActive').setValue('id');
    this.filterForm.get('sortDirection').setValue('desc');

    this.projectService.getProjects(this.filterForm.value).subscribe((res)=>{
      this.dialogRef.close({data:res.data , counter: res.dataSize ,filter:this.filterForm.value});
     })
   }



}
