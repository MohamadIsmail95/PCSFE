import { FilterModel } from "../common/generic";

export interface projectListDto
{
  id:number;
  name:string;
  dateFrom:Date;
  dateTo:Date;
  quota:number;
  type:string;
  typeId:number;
}

export interface typeList
{
  id:number;
  name:string;
}

export interface employeeList
{
  id:number;
  userName:string;
}

export interface projectDetails
{
   id:number;
   gsm:string;
   note:string;
   employeeID:number;
   employeeUserName:string;
   lineTypeId:string;
   callStatusId:string;
   generationId:string;
   regionId:string;
   cityId:string;
   segment:string;
   subSegment:string;
   bundle:string;
   contract:string;
   alternativeNumber:string;
   lineType:string;
   callStatus:string;
   generation:string;
   region:string;
   city:string;
   lastUpdateDate: Date;

}

export interface projectDetailsList extends projectListDto
{
  projectDetails:projectDetails[];
  columnFilters : columnFilters[];
}

export class columnFilters{
  columnName : string;
  distinctValues : string[];
}
export class NotificationDto
{
  projectId: number;
  projectName: string;
  message: string;
}

export interface NotificationListViewModel
{
  id:number;
  projectId:number;
  projectName:string;
  title:string;
  message:string;
  type:string;
  createdDate:Date;
  isRead:boolean;
  duration:string;
  img:string;
}

export interface DashboardFilter
{
  projectId:number;
  dateFrom:Date;
  dateTo:Date;
}

export interface StatisticsReportViewModel
{
  projectName:string;
  createdBy : string;
  addedOn:string;
  generalDetails:categoryCounter[];
  callStatuses:categoryCounter[];
  telemarketerProductivities:productivityVewModel[];
  completedQuotaPerDays:progressQuotaVm[];
}

export interface statusCard
{
  status : string
  gsmCount : number;
}

export interface categoryCounter
{
  category:string;
  count:number;
  total:number;
}

export interface targetViewModel
{
  status:string;
  totalMinutes:number;
  hourPercentage:number;
  target:number;
}

export interface  targetReport
{
  totalMinutes : number;
  closedCallsDurationAvg:number;
  hourlyStatusTargets:targetViewModel[];
}

export interface mistakeViewModel
{
  month : string;
  survey : string;
  telemarketer : string;
  complated : string;
  mistakesCount : string;
  mistakesPercentage : string;
  available : string;
  mark : string;
}

export interface progressQuotaVm
{
  date:Date;
  count:number;
}

export interface generalDashboard
{
  projectGeneralDetails:categoryCounter[];
  callStatuses:categoryCounter[];
  telemarketersProductivity:categoryCounter[];
  completedQuotaPerDays:progressQuotaVm[];
}

export interface productivityVewModel
{
  telemarketer : string;
  assignedGSMs : number;
  completed :number;
  closed:number;
  completedRate:number;
  closedRate:number;
}

export interface hourlyTargetFilter
{
  projectId:number;
  telemarketerId : number;
  targetDate:Date;
}


export interface generalDashboardFilter
{

  projectId: number;
  dateFrom : Date;
  dateTo : Date;
  telemarketerIds :number[];
  lineType : string;
  callStatus: string;
  generation: string;
  region: string;
  city: string;
  segment: string;
  subSegment: string;
  bundle: string;
  contract: string;

}


export interface generalDashboardResponse
{
  projectName : string;
  createdBy : string;
  addedOn : Date;
  generalDetails : categoryCounter[];
  statsticReport

}


export interface telemarketerGSMs
{
  telemarketer : string;
  assignedGSMs : number;
}


export interface statusTelemarketer
{
  status : string;
  telemarketerGSMs : telemarketerGSMs[];
}

export class statsticReportData
{
  data : statusTelemarketer[];
  footer : telemarketerGSMs[];
  closedPerDays : progressQuotaVm[]
}

export interface FilterDic
{
  key:string,
  value: string[]
}

export interface DictionaryViewModel
{
  rangFrom:number,
  rangTo : number;
  value : number;
}

export interface UpdateDictionaryViewModel
{
  projectTypeId:number;
  dictionaryRanges:DictionaryViewModel[];
}
export interface UpdateDictionaryViewModel
{
  projectId:number;
  dictionaryRanges:DictionaryViewModel[];
}

export interface RdayViewModel
{
  key : string;
  remainingDays : number;
}

export interface EvaluationCard
{
  cardTitle : string;
  value : number;
}

export interface SegmentTelemarketersEvaluationsViewModel
{
  employeeUserName : string;
  segment : string;
  workingHours : number;
  closed : number;
  closedPerHour : number;
  segmentTarget : number;
  achievement : number;
  mark : number;
}

export interface EvaluationCardRequest
{
  segmentName : string;
  projectId : number;
}


export interface MistakeReportResponse
{
  projectName : string;
  telemarketerName : string;
  mistakeType : string;
  gsm : string;
  serial : string;
  questionNumber : string;
  segment : string;
  mistakeDescription : string;
  mistakeWeight : string;
  controller : string;
}

export interface MitakeReportFilter
{
  filter : FilterModel;
  projectId : number;
  telemarketerIds : number[];
  mistakeTypes : number[];
}

export interface LookupViewModel
{
  id : number;
  name : string;
}

export interface MistakTypeViewModel
{
  name : string;
  weight : number;
  description : string;
}

export interface TeamMistakeViewModel
{
  projectName : string;
  telemarketer : string;
  completedQuestionnaire : number;
  mistakesCount : number;
  mistakesPercentage : number;
}

export class TeamMitakeReportFilter
{
  filter :  FilterModel = new FilterModel();
  projectsIds : number[];
  telemarketersIds : number[];
}
