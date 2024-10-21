import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { FilterModel } from '../../../common/generic';
import { CommonModule } from '@angular/common';
import {Observable} from 'rxjs';
import {MatInputModule} from '@angular/material/input';
import { employeeList, LookupViewModel, MitakeReportFilter, typeList } from '../../project.const';
import { HttpService } from '../../http.service';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-mistake',
  standalone: true,
  imports: [MatListModule,FormsModule, ReactiveFormsModule,MatFormFieldModule,MatSelectModule,MatButtonModule,
    CommonModule,MatInputModule,MatCardModule,MatIconModule
  ],
  templateUrl: './dialog-mistake.component.html',
  styleUrl: './dialog-mistake.component.scss'
})
export class DialogMistakeComponent implements OnInit {
  filterForm:FormGroup;
  filter:MitakeReportFilter={filter : {searchQuery:"",pageIndex:0,pageSize:5,sortActive:'id',
    sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null} ,
    projectId:0,telemarketerIds:[],mistakeTypes:[]};
  employeeData:LookupViewModel[];
  typeData:LookupViewModel[];

  constructor(private fb:FormBuilder , protected projservice:HttpService,public dialogRef: MatDialogRef<DialogMistakeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
    this.filterForm = this.fb.group({
    'telemarketrerIds':[this.data.telemarketerIds != null ? this.data.telemarketerIds : []],
    'mistakeTypeIds':[this.data.mistakeTypes != null ? this.data.mistakeTypes : []],
    })
  }

  ngOnInit(): void {
    this.getEmployeeList();
    this.getTypeList();

  }
  onSubmit()
  {
    this.filter.projectId = this.data.projectId;
    this.filter.telemarketerIds = this.filterForm.get('telemarketrerIds').value;
    this.filter.mistakeTypes = this.filterForm.get('mistakeTypeIds').value;
    this.projservice.getMistakeReportById(this.filter).subscribe((res)=>{
      this.dialogRef.close({data:res.data , counter: res.dataSize ,filter:this.filter});
     })
  }



  getEmployeeList()
  {
    this.projservice.getMistakeTelemarketerByBroject(this.data.projectId).subscribe((data)=>
    {
      this.employeeData=data;
    }
    )
  }

  getTypeList()
  {
    this.projservice.getMistakeTypeByBroject(this.data.projectId).subscribe((data)=>
    {

      this.typeData=data;
    }
    )
  }
  resetFilter()
  {
   this.filterForm.reset();
   this.filter.filter.pageIndex = 0;
   this.filter.filter.pageSize = 5;
   this.filter.filter.sortActive = '';
   this.filter.filter.sortDirection = '';
   this.filter.projectId = this.data.projectId;
   this.filter.telemarketerIds = [];
   this.filter.mistakeTypes = [];
   this.projservice.getMistakeReportById(this.filter).subscribe((res)=>{
    this.dialogRef.close({data:res.data , counter: res.dataSize ,filter:this.filter});
  })
  }



}
