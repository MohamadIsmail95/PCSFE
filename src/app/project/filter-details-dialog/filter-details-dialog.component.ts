import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from '../http.service';
import {MatCardModule} from '@angular/material/card';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormGroup,Validators, FormsModule, ReactiveFormsModule,FormArray } from '@angular/forms';
import { columnFilters } from '../project.const';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-filter-details-dialog',
  standalone: true,
  imports: [MatButtonModule,MatCardModule,MatSelectModule,MatFormFieldModule,CommonModule,MatListModule,FormsModule, ReactiveFormsModule],
  templateUrl: './filter-details-dialog.component.html',
  styleUrl: './filter-details-dialog.component.scss'
})
export class FilterDetailsDialogComponent implements OnInit {

 filterForm : FormGroup;
 filterOptions : columnFilters[]=[];

  constructor(public dialogRef: MatDialogRef<FilterDetailsDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,protected projectService:HttpService,
     private fb:FormBuilder)  {

      this.filterForm = fb.group({
        'columnName':[''],
        'distinctValues':['']
      })
    }

  ngOnInit(): void {
    console.log(this.data)
  }




  onSelectionChange(event: MatSelectChange , column:string) {
    let data = new columnFilters();
     data.columnName = column;
     data.distinctValues = event.value;
    this.filterOptions.push(data)

  }

  onSubmit()
  {
    this.dialogRef.close({data:this.filterOptions});

  }
}
