import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, Validators,FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { HttpService } from '../../http.service';
import { FilterModel } from '../../../common/generic';
import { employeeList, projectListDto, targetReport } from '../../project.const';
import { Observable, map, startWith } from 'rxjs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [MatGridListModule,MatCardModule,ReactiveFormsModule,MatButtonModule,
    MatFormFieldModule,MatSelectModule,MatAutocompleteModule,CommonModule,FormsModule,MatInputModule,MatTableModule],
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class EvaluationComponent implements OnInit {
filterForm:FormGroup;
projectFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:10000,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
projects :projectListDto[];
myControl = new FormControl('');
options: projectListDto[];
filteredOptions: Observable<projectListDto[]>;
employeeData:employeeList[];
selectedTeleName : string;
selectedTeleId:number;
targetData:targetReport={target:3.5,avgCall:11.5,data:[{status:'Complated',totalHour:123.32,hourPercentage:37,rate:22.11}]}
displayedColumns: string[] = ['status', 'totalHour','hourPercentage','rate'];

constructor(private fb:FormBuilder , private httpService:HttpService){

  this.filterForm = this.fb.group({
    'projectId':[''],
    'telemarId':['',Validators.required]
  });
}
  ngOnInit(): void {
    this.getProjects();
    this.getEmployeeList();
  }

onSubmit()
{
  let pid=this.projects.filter(x=>x.name===this.myControl.value)[0].id;
  this.filterForm.get('projectId').setValue(pid);
  this.selectedTeleName = this.employeeData.filter((x)=>x.id == this.selectedTeleId)[0].userName;
  console.log(this.filterForm.value)
 console.log(this.selectedTeleName)

}
getProjects()
{
  this.httpService.getProjects(this.projectFilter).subscribe((res)=>{
    this.projects=res.data
   this.options = res.data
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  })
}

private _filter(value: string): projectListDto[] {
  const filterValue = value.toLowerCase();

  return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
}

getEmployeeList()
{
  this.httpService.getEmployees().subscribe((data)=>
  {
    this.employeeData=data;
  }
  )
}

getTotalCost() {
  return this.targetData.data.map(t => t.totalHour).reduce((acc, value) => acc + value, 0);
}

}
