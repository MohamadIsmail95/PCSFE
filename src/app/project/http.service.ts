import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DataWithSize, FilterModel } from '../common/generic';
import { BehaviorSubject, Observable, catchError, finalize, retry, throwError } from 'rxjs';
import { DashboardFilter, DictionaryViewModel, EvaluationCard, EvaluationCardRequest, LookupViewModel, MistakTypeViewModel, MistakeReportResponse, MistakeSummaryReport, MitakeReportFilter, RdayViewModel, SegmentTelemarketersEvaluationsViewModel, StatisticsReportViewModel, TeamMistakeViewModel, TeamMitakeReportFilter, UpdateDictionaryViewModel, WeightVsSurveyFilter, WeightVsSurveyLineChart, WeightVsSurveyViewModel, employeeList, generalDashboardFilter, hourlyTargetFilter, projectDetails, projectDetailsList, projectListDto, statsticReportData, statusCard, targetReport, typeList } from './project.const';
import { environment } from '../../environments/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private url = environment.apiUrl+'Projects/';
  private dashboardUrl = environment.apiUrl+'ProjectsStatistics/';
  private rootUrl = environment.apiUrl;
  private evaluationUrl = environment.apiUrl+'ProjectsEvaluation/';
  private mistakeUrl = environment.apiUrl+'MistakeReports/';

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

    private loadingSegmantList = new BehaviorSubject<boolean>(false);
    get loadingSegmantList$(): Observable<boolean> {
      return this.loadingSegmantList.asObservable();
    }

    private loadingSegmantEvaluation = new BehaviorSubject<boolean>(false);
    get loadingSegmantEvaluation$(): Observable<boolean> {
      return this.loadingSegmantEvaluation.asObservable();
    }

    private loadingSegmantCardEvaluation = new BehaviorSubject<boolean>(false);
    get loadingSegmantCardEvaluation$(): Observable<boolean> {
      return this.loadingSegmantCardEvaluation.asObservable();
    }

    private loadingSegmantEvaluationTable = new BehaviorSubject<boolean>(false);
    get loadingSegmantEvaluationTable$(): Observable<boolean> {
      return this.loadingSegmantEvaluationTable.asObservable();
    }

    private SegmantEvaluationTable = new BehaviorSubject<boolean>(false);
    get SegmantEvaluationTable$(): Observable<boolean> {
      return this.SegmantEvaluationTable.asObservable();
    }


    private uploadingMitakeReport = new BehaviorSubject<boolean>(false);
    get uploadingMitakeReport$(): Observable<boolean> {
      return this.uploadingMitakeReport.asObservable();
    }


    private loadingMitakeType = new BehaviorSubject<boolean>(false);
    get loadingMitakeType$(): Observable<boolean> {
      return this.loadingMitakeType.asObservable();
    }

    private loadingTeamMistake = new BehaviorSubject<boolean>(false);
    get loadingTeamMistake$(): Observable<boolean> {
      return this.loadingTeamMistake.asObservable();
    }

    private loadingMistakeSurvy = new BehaviorSubject<boolean>(false);
    get loadingMistakeSurvy$(): Observable<boolean> {
      return this.loadingMistakeSurvy.asObservable();
    }

    private loadingGeneralDash = new BehaviorSubject<boolean>(false);
    get loadingGeneralDash$(): Observable<boolean> {
      return this.loadingGeneralDash.asObservable();
    }

    private loadingSummary = new BehaviorSubject<boolean>(false);
    get loadingSummary$(): Observable<boolean> {
      return this.loadingSummary.asObservable();
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


  getHourlyTraget(input:any) : Observable<targetReport>
  {
    return this.httpClient.post<targetReport>(this.dashboardUrl+'hourlyTarget',input).pipe(finalize(() => this.loadingEvaluationList.next(true)));
  }


 getGeneralReport(input : generalDashboardFilter) : Observable<statsticReportData>
 {
  this.loadingGeneralDash.next(true);
    return this.httpClient.post<statsticReportData>(this.dashboardUrl+'generalReport',input)
    .pipe(finalize(() => this.loadingGeneralDash.next(false)));;
 }


 exportProjects() : Observable<Blob>
 {
   return this.httpClient.get(this.url+'exportProjectsToExcel',{ responseType: 'blob' }).pipe(
    catchError((error) => {
      console.error('File download error:', error);
      return throwError(() => new Error('File download failed'));
    }));
 }


 exportProject(id : number) : Observable<Blob>
 {
   return this.httpClient.get(this.url+'exportProjectDetailsToExcel?projectId='+id,{ responseType: 'blob' }).pipe(
    catchError((error) => {
      console.error('File download error:', error);
      return throwError(() => new Error('File download failed'));
    }));
 }


 getSegmants(): Observable<string[]>
 {
     this.loadingSegmantList.next(true);
     return this.httpClient.get<string[]>(this.rootUrl+'Segments/getSegments')
     .pipe(finalize(() => this.loadingSegmantList.next(false)))
 }


 CreateSegmant(name:string): Observable<any>
 {
     return this.httpClient.post<any>(this.rootUrl+'Segments/addSegment',name)

 }

 getDictionaryByTypeId(id:number):Observable<DictionaryViewModel[]>
 {
   return this.httpClient.get<DictionaryViewModel[]>(this.rootUrl+'ProjectsEvaluation/getProjectTypeDictionary?projectTypeId='+id)
 }

updateDictionaryType(input:UpdateDictionaryViewModel) : Observable<any>
{
   return this.httpClient.put<any>(this.rootUrl+'ProjectsEvaluation/updateProjectTypeDictionary',input)
}


getProjectDictionary(id:number):Observable<DictionaryViewModel[]>
{
  return this.httpClient.get<DictionaryViewModel[]>(this.rootUrl+'ProjectsEvaluation/getProjectDictionary?projectId='+id)
}

updateDictionaryProject(input:UpdateDictionaryViewModel) : Observable<any>
{
   return this.httpClient.put<any>(this.rootUrl+'ProjectsEvaluation/updateProjectDictionary',input)
}

getAdmins():Observable<employeeList[]>
{
   return this.httpClient.get<employeeList[]>(this.url+'getAdmins');
}

getExpectedRemainingDays(id : number):Observable<RdayViewModel>
{
  return this.httpClient.get<RdayViewModel>(this.url+'expectedRemainingDays?projectId='+id);
}

getSegmentEvaluationCard(input : EvaluationCardRequest) : Observable<EvaluationCard[]>
{
  this.loadingSegmantEvaluation.next(true);
  this.loadingSegmantCardEvaluation.next(true);

   return this.httpClient.get<EvaluationCard[]>(this.evaluationUrl+'getProjectSegmentEvaluationCards?projectId='+input.projectId+'&segmentName='+input.segmentName)
   .pipe(finalize(() => this.loadingSegmantEvaluation.next(false)));;
}


getSegmentEvaluationTable(input : EvaluationCardRequest) : Observable<SegmentTelemarketersEvaluationsViewModel[]>
{
  this.SegmantEvaluationTable.next(true);
  this.loadingSegmantEvaluationTable.next(true);

   return this.httpClient.post<SegmentTelemarketersEvaluationsViewModel[]>(this.evaluationUrl+'getProjectSegmentTelemarketersEvaluations',input)
   .pipe(finalize(() => this.loadingSegmantEvaluationTable.next(false)));
}

getProjectSegment(id : number) : Observable<string[]>
{
   return this.httpClient.get<string[]>(this.rootUrl+'Segments/projectSegments?projectId='+id);
}

//------------------------------------------------------
getMistakeDictionaryByTypeId(id:number):Observable<DictionaryViewModel[]>
 {
   return this.httpClient.get<DictionaryViewModel[]>(this.mistakeUrl+'projectTypeMistakeDictionary?projectTypeId='+id)
 }

updateMistakeDictionaryType(input:UpdateDictionaryViewModel) : Observable<any>
{
   return this.httpClient.put<any>(this.mistakeUrl+'updateProjectTypeMistakeDictionary',input)
}


getMistakeProjectDictionary(id:number):Observable<DictionaryViewModel[]>
{
  return this.httpClient.get<DictionaryViewModel[]>(this.mistakeUrl+'projectMistakeDictionary?projectId='+id)
}

updateMistakeDictionaryProject(input:UpdateDictionaryViewModel) : Observable<any>
{
   return this.httpClient.put<any>(this.mistakeUrl+'updateProjectMistakeDictionary',input)
}


UploadMistakeReport(input:FormData):Observable<{ data: MistakeReportResponse[]; dataSize: number }>
  {
    this.uploadingMitakeReport.next(true);

    return this.httpClient.post<{ data: MistakeReportResponse[]; dataSize: number }>(this.mistakeUrl +"UploadMistakeReport",input)
    .pipe(finalize(() => this.uploadingMitakeReport.next(false)));
  }

 getMistakes(input : MitakeReportFilter) : Observable<{ data: MistakeReportResponse[]; dataSize: number }>
 {
   this.uploadingMitakeReport.next(true);
   return this.httpClient.post<{ data: MistakeReportResponse[]; dataSize: number }>(this.mistakeUrl + 'MistakeReport',input)
   .pipe(finalize(() => this.uploadingMitakeReport.next(false)));

 }

 getMistakeTelemarketerByBroject(projectId : number) : Observable<LookupViewModel[]>
 {
    return this.httpClient.get<LookupViewModel[]>(this.mistakeUrl + 'GetMistakeReportTelemarketers/'+projectId);
 }

 getMistakeTypeByBroject(projectId : number) : Observable<LookupViewModel[]>
 {
    return this.httpClient.get<LookupViewModel[]>(this.mistakeUrl + 'GetMistakeTypes/'+projectId);
 }

getMistakeTypeLookup() : Observable<MistakTypeViewModel[]>
{
   this.loadingMitakeType.next(true);
   return this.httpClient.get<MistakTypeViewModel[]>(this.mistakeUrl + 'MistakeTypes')
   .pipe(finalize(() => this.loadingMitakeType.next(false)));

}



getTeamMistakeReport(input : TeamMitakeReportFilter) : Observable<{ data: TeamMistakeViewModel[]; dataSize: number }>
 {
   this.loadingTeamMistake.next(true);
   return this.httpClient.post<{ data: TeamMistakeViewModel[]; dataSize: number }>(this.mistakeUrl + 'GetTeamMistakeReport',input)
   .pipe(finalize(() => this.loadingTeamMistake.next(false)));

 }

getWeightVsSurveyReport(input : WeightVsSurveyFilter) : Observable<WeightVsSurveyViewModel[]>
{
  this.loadingMistakeSurvy.next(true);
  return this.httpClient.post<WeightVsSurveyViewModel[]>(this.mistakeUrl+'WeightVsSurveyReport',input)
  .pipe(finalize(() => this.loadingMistakeSurvy.next(false)));
}

getWeightVsSurveyChart(input : WeightVsSurveyFilter) : Observable<WeightVsSurveyLineChart[]>
{
   return this.httpClient.post<WeightVsSurveyLineChart[]>(this.mistakeUrl+'WeightVsSurveyLineChart',input)
}

getMistakeSummaryReport() : Observable<MistakeSummaryReport[]>
{
  this.loadingSummary.next(true);
  return this.httpClient.get<MistakeSummaryReport[]>(this.mistakeUrl+'GetAll')
  .pipe(finalize(() => this.loadingSummary.next(false)));
}




}
