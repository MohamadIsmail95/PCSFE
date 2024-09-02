import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { HttpService } from '../http.service';
import { FilterModel } from '../../common/generic';
import { StatisticsReportViewModel, employeeList, projectListDto, statusCard } from '../project.const';
import { CommonModule } from '@angular/common';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {LocalStorageService} from '../local-storage.service'

@Component({
  selector: 'app-dashboard-filter',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatListModule,MatFormFieldModule, MatDatepickerModule,
    FormsModule, ReactiveFormsModule,MatButtonModule,CommonModule,
     JsonPipe,MatSelectModule,MatInputModule,MatAutocompleteModule,AsyncPipe],
  templateUrl: './dashboard-filter.component.html',
  styleUrl: './dashboard-filter.component.scss'
})
export class DashboardFilterComponent implements OnInit {

  filterForm:FormGroup;
  projectFilter:FilterModel={searchQuery:"",pageIndex:0,pageSize:10000,sortActive:'id',sortDirection:'desc',dateFrom:null,dateTo:null,createdBy:null,typeIds:null};
  projects :projectListDto[];
  myControl = new FormControl('');
  options: projectListDto[];
  filteredOptions: Observable<projectListDto[]>;
  dashStatics:StatisticsReportViewModel;
  newValue : any;
  employees : employeeList[];
  constructor(private _bottomSheetRef: MatBottomSheetRef<DashboardFilterComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private fb:FormBuilder , protected projectService:HttpService,
    private localStorageService:LocalStorageService
  )

  {
    this.filterForm = this.fb.group({
      'dateFrom':['',Validators.required],
      'dateTo':['',Validators.required],
      'projectId':[''],
      'telemarketerIds':['',Validators.required],
      'lineType':[''],
      'callStatus':[''],
      'generation':[''],
      'region':[''],
      'city':[''],
      'segment':[''],
      'subSegment':[''],
      'bundle':[''],
      'contract':[''],

    })
  }
  ngOnInit(): void {
    this.getProjects();
    this.getEmployees();
  }

  openLink(event: MouseEvent): void {
    event.preventDefault();
  }

  onSubmit()
  {
    let pid=this.projects.filter(x=>x.name===this.myControl.value)[0];
     this.filterForm.get('projectId').setValue(pid.id);

    this.projectService.getGeneralReport(this.filterForm.value).subscribe((res)=>{
     this.data = {card:res , filter:this.filterForm.value}
      this.checkOnlocalStorage(this.data);
     this._bottomSheetRef.dismiss(this.data);

    })
  }

  getProjects()
  {
    this.projectService.getProjects(this.projectFilter).subscribe((res)=>{
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

  checkOnlocalStorage(data:any)
  {
    let storage = this.localStorageService.getItem('dashboardData');
    if(storage!=null)
      {
        this.localStorageService.removeItem('dashboardData');
      }

      this.localStorageService.setItem('dashboardData',JSON.stringify(data))
  }

  sendTheNewValue(event){
    let project = this.projects.filter(x=>x.name ===  event.option.value)[0];
    this.filterForm.get('dateFrom').setValue(project.dateFrom);
    this.filterForm.get('dateTo').setValue(project.dateTo);

    }


  getEmployees()
  {
    this.projectService.getEmployees().subscribe((response)=>{
      this.employees = response
    })
  }


}
