import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpService } from './service/http.service';
import { NotificationsService } from './service/notifications.service';
import { SocketService } from './service/socket.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private socketService: SocketService, private notificationService: NotificationsService) { }

  ngOnInit() {
    this.socketService.startSocketConnection()
    this.socketService.socketListener("message-received").subscribe((dataSocket) => {
      this.notificationService.sendToast("Hai ricevuto un nuovo messaggio!")
    })
    this.socketService.socketListener("answer-received").subscribe((dataSocket) => {
      this.notificationService.sendToast("Hai ricevuto una nuova risposta ad una domanda!")
    })
    this.socketService.socketListener("answer-accepted").subscribe((dataSocket) => {
      this.notificationService.sendToast("Una tua risposta è stata accettata!")
    })
  }
}
