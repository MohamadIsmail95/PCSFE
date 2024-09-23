import { Component, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { EvaluationCard, SegmentTelemarketersEvaluationsViewModel } from '../project.const';
import {CardComponent} from '../charts/card/card.component';
import {NumberCounterComponent} from './../charts/number-counter/number-counter.component';
import { map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-segment-evaluation',
  standalone: true,
  imports: [MatGridListModule,MatCardModule,MatFormFieldModule,MatInputModule,MatProgressBarModule,
    MatSelectModule,MatButtonModule,MatTableModule,ReactiveFormsModule,FormsModule,
    MatExpansionModule,MatIconModule,CommonModule,CardComponent,NumberCounterComponent,
    MatPaginatorModule,MatSortModule
  ],
  templateUrl: './segment-evaluation.component.html',
  styleUrl: './segment-evaluation.component.scss'
})
export class SegmentEvaluationComponent implements OnInit
{
  projectId : number;
  segments : string[] = [];
  segmantForm : FormGroup;
  accordion = viewChild.required(MatAccordion);
  private breakpointObserver = inject(BreakpointObserver);
  cardData : EvaluationCard[] = [];
  displayedColumns: string[] = ['employeeUserName', 'segment', 'workingHours', 'closed','closedPerHour','segmentTarget','achievement','mark'];
  dataSource: MatTableDataSource<SegmentTelemarketersEvaluationsViewModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



 constructor(protected projectService:HttpService,private route: ActivatedRoute,
  private fb : FormBuilder)
  {

    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    })


    this.segmantForm = this.fb.group({
      segmentName : ['',Validators.required],
      projectId : [this.projectId,Validators.required]
    });

  }


  ngOnInit(): void {

    this.getSegments();
  }
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: { cols: 1, rows: 1 },
          chart: { cols: 1, rows: 2 },
          table: { cols: 1, rows: 2 },
        };
      }

     return {
        columns: 4,
        miniCard: { cols: 1, rows: 1 },
        chart: { cols: 2, rows: 2 },
        table: { cols: 4, rows: 2 },
      };
    })
  );
  getSegments()
  {
    this.projectService.getProjectSegment(this.projectId).subscribe((response)=>{
      this.segments = response;
    });
  }

  onSubmit()
  {
    this.projectService.getSegmentEvaluationCard(this.segmantForm.value).subscribe((response)=>{
      this.cardData = response

    })

    this.projectService.getSegmentEvaluationTable(this.segmantForm.value).subscribe((response)=>{

      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
