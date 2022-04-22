import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  public startSocketConnection() {
    this.socket.connect();
  }

  public emitSocketEvent(nomeEvento: string, param: object): any {
    return this.socket.emit(nomeEvento, param);
  }

  public socketListener(nomeEvento: string): any {
    return this.socket.fromEvent(nomeEvento);
  }
}
