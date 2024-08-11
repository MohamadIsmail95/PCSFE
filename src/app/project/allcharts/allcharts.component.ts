import { Component, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, tap } from 'rxjs/operators';
import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import {CardComponent} from '../charts/card/card.component';
import{BarComponent} from '../charts/bar/bar.component';
import { LineComponent } from '../charts/line/line.component';
import { PieComponent } from '../charts/pie/pie.component';
import { RadarComponent } from '../charts/radar/radar.component';
import { DataTableComponent } from '../charts/data-table/data-table.component';
//----------------------------------------------
import {MatGridListModule} from '@angular/material/grid-list';
import {NumberCounterComponent} from './../charts/number-counter/number-counter.component';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import { MatBottomSheet,MatBottomSheetModule, MatBottomSheetRef,} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { DashboardFilterComponent } from '../dashboard-filter/dashboard-filter.component';
import {MatIconModule} from '@angular/material/icon';
import { HttpService } from '../http.service';
import { StatisticsReportViewModel, categoryCounter, productivityVewModel, statusCard } from '../project.const';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxCaptureService } from 'ngx-capture';
import { NgxCaptureModule } from 'ngx-capture';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-allcharts',
  standalone: true,
  imports: [MatGridListModule,CommonModule,CardComponent,BarComponent,LineComponent,
    PieComponent,RadarComponent,DataTableComponent,NumberCounterComponent,
    MatTableModule,MatCardModule,MatBottomSheetModule,MatButtonModule,
     MatBottomSheetModule,MatIconModule,MatProgressBarModule,NgxCaptureModule],
  templateUrl: './allcharts.component.html',
  styleUrl: './allcharts.component.scss',
  providers: [DatePipe]

})
export class AllchartsComponent implements OnInit  {
  imgBase64 = '';
  @ViewChild('screen', { static: true }) screen: any;

  constructor(private _bottomSheet: MatBottomSheet ,protected  projectService:HttpService,
    private captureService: NgxCaptureService, private localStorageService:LocalStorageService ) {}

  displayedColumns = ['category', 'count'];
  productivityDisplayedColumns = ['telemarketer', 'assignedGSMs','completed','closed','closedRate','completedRate'];

  dataSource : categoryCounter[]=[];
  productivityDataSource : productivityVewModel[]=[];
  projectDetails:any;
  xLineBar:string[];
  yLineBar:number[];
  xLinePie:string[];
  yLinePie:number[];
  xLineLine:string[];
  yLineLine:number[];
  creationDate : Date;
  ngOnInit(): void {
    this.getLocalStorageData();

  }

  private breakpointObserver = inject(BreakpointObserver);

  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: { cols: 4, rows: 1 },
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



  openBottomSheet(): void {

   const bottom= this._bottomSheet.open(DashboardFilterComponent);
   bottom.afterDismissed().subscribe(result => {
    this.projectDetails = result != null ? result.card :this.projectDetails;
    this.projectDetails.addedOn = this.projectDetails.addedOn.substring(0, 10);
    this.dataSource = this.projectDetails.callStatuses
    this.productivityDataSource = this.projectDetails.telemarketerProductivities;
    this.xLineBar = this.projectDetails.callStatuses.map((x)=>x.category)
    this.yLineBar = this.projectDetails.callStatuses.map((x)=>x.count)
    this.xLineLine = this.projectDetails.completedQuotaPerDays.map((x)=>x.date)
    this.yLineLine = this.projectDetails.completedQuotaPerDays.map((x)=>x.count)
   })

  }

//-------------Page ScreenShoot-----------------

capture() {

    this.captureService.getImage(this.screen.nativeElement, true)
.pipe(
  tap(img => {

    this.captureService.downloadImage(img)
  })
).subscribe();
}

getLocalStorageData()
{
  this.projectDetails=JSON.parse(this.localStorageService.getItem('dashboardData')).card ;
  this.projectDetails.addedOn = this.projectDetails.addedOn.substring(0, 10);

  this.dataSource = this.projectDetails.callStatuses;
  this.productivityDataSource = this.projectDetails.telemarketerProductivities;
  this.xLineBar = this.projectDetails.callStatuses.map((x)=>x.category)
  this.yLineBar = this.projectDetails.callStatuses.map((x)=>x.count)
  this.xLineLine = this.projectDetails.completedQuotaPerDays.map((x)=>x.date)
  this.yLineLine = this.projectDetails.completedQuotaPerDays.map((x)=>x.count)

}

}

