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
import { employeeList, typeList } from '../../project.const';
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
  employeeData:employeeList[];
  typeData:typeList[];

  constructor(private fb:FormBuilder , protected projservice:HttpService,public dialogRef: MatDialogRef<DialogMistakeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
    this.filterForm = this.fb.group({
    'telemarketrerIds':[''],
    'mistakeTypeIds':[''],
    'gsm':[''],
    'controllerIds':['']
    })
  }

  ngOnInit(): void {
    this.getEmployeeList();
    this.getProjectType();
  }
  onSubmit()
  {
    // this.projservice.getProjects(this.filterForm.value).subscribe((res)=>{
    //   this.dialogRef.close({data:res.data , counter: res.dataSize ,filter:this.filterForm.value});
    //  })
    console.log(this.filterForm.value)
  }

  getProjectType()
  {
    this.projservice.getTypes().subscribe((res)=>{
      this.typeData=res;
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
  resetFilter()
  {
   this.filterForm.reset();
   this.filterForm.get('pageIndex').setValue(0);
   this.filterForm.get('pageSize').setValue(5);
   this.filterForm.get('sortActive').setValue('id');
   this.filterForm.get('sortDirection').setValue('desc');

  //  this.projservice.getMistakes(this.filterForm.value).subscribe((res)=>{
  //    this.dialogRef.close({data:res.data , counter: res.dataSize ,filter:this.filterForm.value});
  //   })
  }



}
