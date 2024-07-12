import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { HttpService } from '../http.service';
import { AccountService } from '../../app-core/services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,MatSelectModule,CommonModule
  ],
   templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent  implements OnInit{
  isAdmin:boolean;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,protected projectService:HttpService,
    private accountService:AccountService
  )
  {

  }
  ngOnInit(): void {
    this.IsAdminRole();
  }


  onNoClick(): void {
    this.data.details.employeeUserName=this.data.employeelis.filter(x=>x.id===this.data.details.employeeID)[0].userName;
    this.data.details.callStatusId=this.data.status.filter(x=>x.id===this.data.details.callStatusId)[0].id;
    this.data.details.callStatus=this.data.status.filter(x=>x.id===this.data.details.callStatusId)[0].name;
     this.projectService.updateProjectDetail(this.data.details).subscribe((res)=>{
     })
    //this.dialogRef.close(this.data);
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

}
