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
  closedCallsAvg:number;
  hourlyStatusTargets:targetViewModel[];
}

export interface mistakeViewModel
{
  surveyName:string; //projectName
  surveyId:number;
  telemarketerName:string;
  telemarketerId:number;
  mistakeType:string;
  mistakeTypeId:string;
  gsm:string;
  serial:string;
  questionNumber:string;
  segment:string;
  description:string;
  wieght:string;
  controller:string;  //project type
  controllerId:number;
  adminRemark:string;
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

