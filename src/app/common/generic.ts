export interface DataWithSize<T> {
    data: T[];
    dataSize: number;
}

export enum enSortDirection {
    asc,
    desc
}
export interface ResultWithMessage {
    data: any;
    message?: string;
}


export class FilterModel
{
  searchQuery:string;
  pageIndex:number;
  pageSize:number;
  sortActive:string;
  sortDirection:string;
  dateFrom :Date;
  dateTo : Date;
  createdBy : string[];
  typeIds : number[];
  projectId?:number;
}
