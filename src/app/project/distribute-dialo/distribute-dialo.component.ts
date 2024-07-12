import { Component, Inject, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { employeeList } from '../project.const';
import { Unsubscriber } from 'techteec-lib/common';

@Component({
  selector: 'app-distribute-dialo',
  standalone: true,
  imports: [ MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,MatSelectModule,CommonModule],
  templateUrl: './distribute-dialo.component.html',
  styleUrl: './distribute-dialo.component.scss'
})
export class DistributeDialoComponent extends Unsubscriber  implements OnInit
{

  employeeData:employeeList[];
  selectedEmployees:string;
  constructor(public dialogRef: MatDialogRef<DistributeDialoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,protected projectService:HttpService)
  {
    super();
  }
  ngOnInit(): void {
    this.getEmployeeList();
  }

  onNoClick()
  {
    this._otherSubscription = this.projectService.redistributeProject(this.data.id,this.selectedEmployees.toString())
     .subscribe((res)=>{
     })

  }
  getEmployeeList()
  {
    this._otherSubscription = this.projectService.getEmployees().subscribe((data)=>
    {
      this.employeeData=data;
    }
    )
  }


}
