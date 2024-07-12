import { Injectable, inject } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { NotificationDto, NotificationListViewModel } from './project.const';
import { BehaviorSubject, Observable, delay, empty, finalize } from 'rxjs';
import { ToasterService } from './Toaster/ToasterService';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ThemeService } from 'ng2-charts';

@Injectable({
  providedIn: 'root'
})
export class NotificationService  {
  private url = environment.apiUrl+'Notification/';
  private httpClient = inject(HttpClient);
  private hubConnection: signalR.HubConnection;
  notList:NotificationListViewModel[]=[];
  connId:string;
  notificationLength = new BehaviorSubject<number>(0);
  get notificationLength$(): Observable<number> {
    return this.notificationLength.asObservable();
  }
  constructor(private toaster: ToasterService){}

  public pushedNotification = new  BehaviorSubject<NotificationListViewModel[]>([]);

   get pushedNotification$(): Observable<NotificationDto[]> {
    return this.pushedNotification.asObservable();
  }



  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://192.168.5.139:4001/Notify',{ skipNegotiation: true,
                            transport: signalR.HttpTransportType.WebSockets})
                            .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .then(()=>this.getUserConnectionId())
      .catch(err => console.log('Error while starting connection: ' + err))

  }


  public addProjectListner = () => {
    this.hubConnection.on('SendMessage', (notification: NotificationListViewModel) => {
      this.notList.push(notification)
      this.pushedNotification.next(this.notList);
      this.notificationLength.next(this.notificationLength.value+1)
      this.showSuccessToaster(notification.message,notification.title)
    });


  }

  get getLocalNotification(): NotificationDto[] | null {
    const notificationString = localStorage.getItem('Notification');
    if(!notificationString) {
      return null;
    }
    const noti = JSON.parse(notificationString) as NotificationDto[];
    return noti;
  }


  showSuccessToaster(msg:string , title:string) {
    this.toaster.show('success', title, msg,4000);
  }
  showErrorToaster() {
    this.toaster.show('error', 'Check it out!', 'This is a error alert');
  }
  showWarningToaster() {
    this.toaster.show('warning', 'Check it out!', 'This is a warning alert', 3000);
  }

  getUserConnectionId()
  {
    this.hubConnection.invoke('GetConnectionId').then((connectionId)=> {
      this.UpdateConnectionHub(connectionId).subscribe((res)=>{})

    })
  }

  UpdateConnectionHub(conId:string):Observable<any>
  {
  return this.httpClient.get<any>(this.url+'UpdateHubClient?connectionId='+conId);

  }

  ReadNotification(id:number):Observable<any>
  {
    return this.httpClient.get<any>(this.url+'ReadNotification?id='+id);
  }

  GetUserNotifications():Observable<{ data: NotificationListViewModel[]; dataSize: number }>
  {
    return this.httpClient.get<{ data: NotificationListViewModel[]; dataSize: number }>(this.url+'GetUserNotification');

  }

}
