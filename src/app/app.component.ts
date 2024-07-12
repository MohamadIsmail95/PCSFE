import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, provideRouter, withHashLocation } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { NotificationService } from './project/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Telemarketing';
  constructor(private notificationService:NotificationService){
    this.notificationService.startConnection();
    this.notificationService.addProjectListner();
  }
}
