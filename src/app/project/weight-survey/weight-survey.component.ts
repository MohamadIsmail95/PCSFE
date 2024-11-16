import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { HttpService } from '../http.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { employeeList, MistakTypeViewModel, WeightVsSurveyLineChart } from '../project.const';
import { BarComponent } from '../charts/bar/bar.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {ChangeDetectionStrategy, signal} from '@angular/core';
@Component({
  selector: 'app-weight-survey',
  standalone: true,
  imports: [MatCardModule,CommonModule,MatButtonModule,MatFormFieldModule,MatSelectModule,
    ReactiveFormsModule,MatProgressBarModule,BarComponent,MatExpansionModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './weight-survey.component.html',
  styleUrl: './weight-survey.component.scss'
})
export class WeightSurveyComponent {

  telemarketers: string[] = [];
  tableData: any[] = [];
  httpService = inject(HttpService);
  surveyForm : FormGroup;
  employeeData:employeeList[];
  mistakeTypeData : MistakTypeViewModel[];
  dataChart : WeightVsSurveyLineChart[];
  xLineLine:string[];
  yLineLine:number[];
  readonly panelOpenState = signal(false);

  constructor(private _fb:FormBuilder){
    this.getEmployeeList();
    this.getMistakeTypes();
    this.surveyForm = this._fb.group({
      mistakeTypes : [[]],
      employeeIds : [[]]
    })
  }

  processData(data: any[]): void {
    const telemarketersSet = new Set<string>();

    data.forEach(item => {
      item.telemarketerMistakes.forEach((survey: any) => {
        telemarketersSet.add(survey.telemarketer);
      });
    });

    this.telemarketers = Array.from(telemarketersSet);
    this.tableData = data;

  }

  getSurveyValue(telemarketerSurvey: any[], telemarketer: string): number | string {
    const survey = telemarketerSurvey.find(t => t.telemarketer === telemarketer);
    return survey ? survey.mistakesCount : '-';
  }

  getTotalGSMs(telemarketer: string): number {
    let total = 0;

    this.tableData.forEach(item => {
      const surveyData = item.telemarketerMistakes.find(t => t.telemarketer === telemarketer);
      if (surveyData) {
        total += surveyData.mistakesCount;
      }
    });

    return total;
  }

  onSubmit()
  {
    this.httpService.getWeightVsSurveyReport(this.surveyForm.value).subscribe((response) =>{
        this.processData(response);
    })
    this.httpService.getWeightVsSurveyChart(this.surveyForm.value).subscribe((response) =>{
      this.xLineLine = response.map((x)=>x.mistakeType)
       this.yLineLine = response.map((x)=>x.telemarketerMistakesCount)

  })
  }

  getEmployeeList()
  {
   this.httpService.getEmployees().subscribe((data)=>
    {
      this.employeeData=data;
    }
    )
  }

  getMistakeTypes()
  {
    this.httpService.getMistakeTypeLookup().subscribe((response) =>{
     this.mistakeTypeData = response
    })
  }

}
