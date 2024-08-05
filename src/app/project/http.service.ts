import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DataWithSize, FilterModel } from '../common/generic';
import { BehaviorSubject, Observable, catchError, finalize, retry, throwError } from 'rxjs';
import { DashboardFilter, StatisticsReportViewModel, employeeList, hourlyTargetFilter, projectDetails, projectDetailsList, projectListDto, statusCard, targetReport, typeList } from './project.const';
import { environment } from '../../environments/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private url = environment.apiUrl+'Projects/';
  private dashboardUrl = environment.apiUrl+'ProjectsStatistics/';

  private httpClient = inject(HttpClient);
  constructor() { }

    //Loaders
    private loadingList = new BehaviorSubject<boolean>(false);
    get loadingList$(): Observable<boolean> {
      return this.loadingList.asObservable();
    }

    private loadingDetails = new BehaviorSubject<boolean>(false);
    get loadingDetails$(): Observable<boolean> {
      return this.loadingDetails.asObservable();
    }

    private loadingCreate = new BehaviorSubject<boolean>(false);
    get loadingCreate$(): Observable<boolean> {
      return this.loadingCreate.asObservable();
    }

    private loadingEdit = new BehaviorSubject<boolean>(false);
    get loadingEdit$(): Observable<boolean> {
      return this.loadingEdit.asObservable();
    }

    private redistributedList = new BehaviorSubject<boolean>(false);
    get redistributedList$(): Observable<boolean> {
      return this.redistributedList.asObservable();
    }

    private dashboardLoading = new BehaviorSubject<boolean>(false);
    get dashboardLoading$(): Observable<boolean> {
      return this.dashboardLoading.asObservable();
    }

    private loadingEvaluationList = new BehaviorSubject<boolean>(false);
    get loadingEvaluationList$(): Observable<boolean> {
      return this.loadingEvaluationList.asObservable();
    }










    getProjects(filterM:FilterModel):Observable<{ data: projectListDto[]; dataSize: number }>
  {
    this.loadingList.next(true);
    return this.httpClient.post<{ data: projectListDto[]; dataSize: number }>(this.url+"getByFilter",
     filterM ).pipe(finalize(() => this.loadingList.next(false)));
  }

  getExcelProjects(filterM:FilterModel):Observable<{ data: projectListDto[]; dataSize: number }>
  {
    return this.httpClient.post<{ data: projectListDto[]; dataSize: number }>(this.url+"getByFilter",
     filterM );
  }
  createProject(project:FormData):Observable<any>
  {
    this.loadingCreate.next(true);

    return this.httpClient.post<any>(this.url+"Create",project).pipe(finalize(() => this.loadingCreate.next(false)));
  }

  getEmployees():Observable<employeeList[]>
  {
     return this.httpClient.get<employeeList[]>(this.url+"getEmployees");
  }



   getById(id:number , filter:FilterModel):Observable<{ data: projectDetailsList; dataSize: number }>
   {
    this.loadingDetails.next(true);
     return this.httpClient.post<{ data: projectDetailsList; dataSize: number }>(this.url+"getById?id="+id,filter).pipe(finalize(() => this.loadingDetails.next(false)));
   }

   update(input:projectDetailsList):Observable<any>
   {
    this.loadingEdit.next(true);

      return this.httpClient.put<any>(this.url+"update",input).pipe(finalize(() => this.loadingEdit.next(false)));
   }

  delete(id:number):Observable<number>
  {
    return this.httpClient.delete<number>(this.url+"delete?id="+id);
  }

  getTypes():Observable<typeList[]>
  {
    return this.httpClient.get<typeList[]>(this.url+"getProjectTypes")
  }

  getStatus():Observable<typeList[]>
  {
    return this.httpClient.get<typeList[]>(this.url+"getCallStatuses")
  }

  getLineType():Observable<typeList[]>
  {
    return this.httpClient.get<typeList[]>(this.url+"getLineTypes")
  }

  getRegion():Observable<typeList[]>
  {
    return this.httpClient.get<typeList[]>(this.url+"getRegions")
  }

  getCities():Observable<typeList[]>
  {
    return this.httpClient.get<typeList[]>(this.url+"getCities")
  }

  getGeneration():Observable<typeList[]>
  {
    return this.httpClient.get<typeList[]>(this.url+"getLineGenerations")
  }

  redistributeProject(projectId:number , EmployeeIds:string):Observable<any>
  {
    this.redistributedList.next(true);
    return this.httpClient.get(this.url+"reDistributeProjectGSMs?projectId="+projectId+"&EmployeeIds="+EmployeeIds)
    .pipe(finalize(() => this.redistributedList.next(false)));
  }

  updateProjectDetail(projectDetail:projectDetails):Observable<any>
  {
    return this.httpClient.put(this.url+"updateProjectDetail",projectDetail)
  }


  getStatistics(input:DashboardFilter):Observable<StatisticsReportViewModel>
  {

    this.dashboardLoading.next(true);
     return this.httpClient.get<StatisticsReportViewModel>(this.dashboardUrl+
      "getProjectStatistics?projectId="+input.projectId+"&dateFrom="
      +formatDate(input.dateFrom,'yyyy-MM-dd', "en-US")+"&dateTo="+formatDate(input.dateTo,'yyyy-MM-dd', "en-US"))
      .pipe(finalize(() => this.dashboardLoading.next(false)));
  }


  getHourlyTraget(input:hourlyTargetFilter) : Observable<targetReport>
  {
    return this.httpClient.get<targetReport>(this.dashboardUrl+'hourlyTelemarketerTarget'+'?projectId='+
      input.projectId+'&telemarketerId='+input.telemarketerId+'&targetDate='+formatDate(input.targetDate,'yyyy-MM-dd', "en-US").toString()+'&hour='
      + Number(input.hour) ).pipe(finalize(() => this.loadingEvaluationList.next(true)));
  }


}
