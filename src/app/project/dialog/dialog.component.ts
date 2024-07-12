import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog,MatDialogRef,MatDialogActions,MatDialogClose,MatDialogTitle,MatDialogContent, MAT_DIALOG_DATA,} from '@angular/material/dialog';
import { HttpService } from '../http.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,MatSnackBarModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    protected projectService:HttpService,
    private _snackBar: MatSnackBar,private router: Router
  ){}
  ngOnInit(): void {
  }

  deleteProject(id:number)
  {
    this.projectService.delete(id).subscribe((response)=>{
      window.location.reload();
      this.openSnackBar("Deleted successfully","Close")

    },(error)=>{
      this.openSnackBar(error.error.message,'Close')

     })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
