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
import {map, Observable, of, startWith} from 'rxjs';
import {MatInputModule} from '@angular/material/input';
import { employeeList, LookupViewModel, mistakeViewModel, MistakTypeViewModel, MitakeReportFilter, projectListDto, typeList } from '../../project.const';
import { HttpService } from '../../http.service';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';




@Component({
  selector: 'app-dialog-mistake',
  standalone: true,
  imports: [CommonModule,MatListModule,FormsModule, ReactiveFormsModule,MatFormFieldModule,
    MatSelectModule,MatButtonModule,MatChipsModule
    ,MatInputModule,MatCardModule,MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './dialog-mistake.component.html',
  styleUrl: './dialog-mistake.component.scss'
})
export class DialogMistakeComponent implements OnInit {
  filterForm:FormGroup;
  filter:MitakeReportFilter={filter : {searchQuery:"",pageIndex:0,pageSize:5,sortActive:'id',
    sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null}
    ,telemarketerIds:[],mistakeTypes:[],projectIds:[]};

  employeeData:employeeList[];
  typeData:MistakTypeViewModel[];
  projectFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:10000,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
  projects :projectListDto[];
  myControl = new FormControl('');
  options: projectListDto[];
  filteredOptions: Observable<projectListDto[]>;

  allItems: projectListDto[] = [];
  selectedItems: string[] = [];
  filteredItems: Observable<projectListDto[]>;




  constructor(private fb:FormBuilder , protected projservice:HttpService,public dialogRef: MatDialogRef<DialogMistakeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
    this.filterForm = this.fb.group({
    'telemarketrerIds':[this.data.telemarketerIds != null ? this.data.telemarketerIds : []],
    'mistakeTypeIds':[this.data.mistakeTypes != null ? this.data.mistakeTypes : []],
    'projectIds':[this.data.projectIds != null ? this.data.projectIds : []],

    })
  }

  ngOnInit(): void {
    this.getProjects();
    this.getEmployeeList();
    this.getTypeList();


  }
  onSubmit()
  {
    this.filter.telemarketerIds = this.filterForm.get('telemarketrerIds').value;
    this.filter.mistakeTypes = this.filterForm.get('mistakeTypeIds').value;
    this.filter.projectIds = this.filterForm.get('projectIds').value;
    this.projservice.getMistakes(this.filter).subscribe((res)=>{
      this.dialogRef.close({data:res.data , counter: res.dataSize ,filter:this.filter});
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

  getTypeList()
  {
    this.projservice.getMistakeTypeLookup().subscribe((data)=>
    {

      this.typeData=data;
    }
    )
  }
  resetFilter()
  {
    this.selectedItems.splice(0, 100000);
   this.filterForm.reset();
   this.filter.filter.pageIndex = 0;
   this.filter.filter.pageSize = 5;
   this.filter.filter.sortActive = '';
   this.filter.filter.sortDirection = '';
   this.filter.telemarketerIds = [];
   this.filter.mistakeTypes = [];
   this.filter.projectIds = [];

   this.projservice.getMistakes(this.filter).subscribe((res)=>{
    this.dialogRef.close({data:res.data , counter: res.dataSize ,filter:this.filter});
  })
  }

  getProjects()
{
  this.projservice.getProjects(this.projectFilter).subscribe((res)=>{
    this.allItems=res.data
   this.options = res.data

   this.filteredItems = this.filterForm.get('projectIds').value != null ?
   this.filterForm.get('projectIds').valueChanges.pipe(
    startWith(''),
    map((value: string | null) => (value ? this._filter(value) : this.allItems.slice()))

  )  : of(this.allItems)


  })
}


add(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();

  // Add item
  if (value && !this.selectedItems.includes(value)) {
    this.selectedItems.push(value);
  }

  // Clear the input value
  event.chipInput!.clear();
  this.filterForm.get('projectIds')
  .setValue(this.allItems.filter(x => this.selectedItems.includes(x.name)).map(x =>x.id));
}

remove(item: string): void {
  const index = this.selectedItems.indexOf(item);

  if (index >= 0) {
    this.selectedItems.splice(index, 1);
  }
}

selected(event: MatAutocompleteSelectedEvent): void {
  const value = event.option.viewValue;

  if (!this.selectedItems.includes(value)) {
    this.selectedItems.push(value);
  }

  this.filterForm.get('projectIds')
  .setValue(this.allItems.filter(x => this.selectedItems.includes(x.name)).map(x =>x.id));
}


private _filter(value: string): projectListDto[] {
  const filterValue = value.toLowerCase();

  return this.allItems.filter(item => item.name.toLowerCase().includes(filterValue));
}




}
