import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { Notificacion, DatosCompartidosService } from './datos-compartidos.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private stompClient: any
  private messageSubject: BehaviorSubject<Notificacion[]> = new BehaviorSubject<Notificacion[]>([]);

  constructor(
    private datosCompartidos: DatosCompartidosService
  ) { 
    this.initConnenctionSocket();
  }

  initConnenctionSocket() {
    const url = environment.baseUrl+'/ws';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket)
  }

  joinRoom(roomId: string) {
    this.stompClient.connect({}, ()=>{
      this.stompClient.subscribe(`/topic/valida-cliente/${roomId}`, (messages: any) => {
        const messageContent = JSON.parse(messages.body)as Notificacion;
        this.datosCompartidos.agregarNotificacion(messageContent);

      })
    })
  }

  sendMessage(roomId: string, chatMessage: Notificacion) {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
  }

  getMessageSubject(){
    return this.messageSubject.asObservable();
  }
}