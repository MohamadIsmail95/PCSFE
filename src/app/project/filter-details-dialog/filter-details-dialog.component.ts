import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from '../http.service';
import {MatCardModule} from '@angular/material/card';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatListModule } from '@angular/material/list';
import { FormBuilder, FormGroup,Validators, FormsModule, ReactiveFormsModule,FormArray, FormControl } from '@angular/forms';
import { columnFilters, FilterDic } from '../project.const';
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
 optionsMap: { [key: string]: string[] } = {};

 filterOptions : columnFilters[]=[];
 convertDataArr : FilterDic []=[];
  constructor(public dialogRef: MatDialogRef<FilterDetailsDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,protected projectService:HttpService,
     private fb:FormBuilder)  {
      this.initializeForm();

    }

  ngOnInit(): void {
    this.buildForm(this.data.d,this.data.y);
   console.log(this.data.y)
  }

  initializeForm(): void {
    this.filterForm = this.fb.group({});
  }



  onSelectionChange(event: MatSelectChange , column:string) {
    let data = new columnFilters();
     data.columnName = column;
     data.distinctValues = event.value;

     for (let i = this.filterOptions.length - 1; i >= 0; i--) {
      if (this.filterOptions[i].columnName === column) {
          this.filterOptions.splice(i, 1);
      }
  }


     this.filterOptions.push(data)

  }

  onSubmit()
  {
    let arrObject =[];
    arrObject.push(this.filterForm.value)
    this.dialogRef.close({data: this.filterOptions.length > 0 ?  this.filterOptions : arrObject});

  }


  buildForm(data: any , redData:any): void {
    let transformedObject = this.transformColumnFilters(data);
    let transRefDataObject = null;
    if(redData != null)
    {
       transRefDataObject = this.transformColumnFilters(redData);

    }

    Object.keys(transformedObject).forEach(key => {
      if(transRefDataObject != null)
      {
        this.filterForm.addControl(key, new FormControl(transRefDataObject[key] || []));

      }
      else
      {
        this.filterForm.addControl(key, new FormControl([]));

      }
      this.optionsMap[key] = transformedObject[key] || [];
    });

  }
  getOptions(controlName: string): string[] {
    return this.optionsMap[controlName] || [];
  }
  transformColumnFilters(columnFilters: Array<{ columnName: string, distinctValues: string[] }>): { [key: string]: string[] } {
  return columnFilters.reduce((acc, filter) => {
    acc[filter.columnName] = filter.distinctValues;
    return acc;
  }, {} as { [key: string]: string[] });
}

}

