import {Injectable} from '@angular/core';
import {MessageDto} from '../dto/MessageDto';
import {Message} from '../entity/Message';
import {SERVER_PATH} from '../../globals';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppComponent} from '../app.component';

declare var SockJS;
declare var Stomp;

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public stompClient;
  public messages: Message[] = [];

  constructor(public http: HttpClient) {
    this.subscribeNewMessages(msg => {
      this.messages.push(msg);

    });
  }

  subscribeNewMessages(onMessage: (message) => void) {
    const ws = new SockJS(SERVER_PATH + '/socket');
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/message', (msg) => {
        const parsedMessage = JSON.parse(msg.body);
        const message = new Message();
        message.id = parsedMessage.id;
        message.user.id = parsedMessage.user.id;
        message.value = parsedMessage.value;
        onMessage(message);
      });
    });
  }

  sendMessage(message: MessageDto) {
    this.stompClient.send('/app/send/message', {}, JSON.stringify(message));
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(SERVER_PATH + '/getMessages');
  }

  getMessagesBeforeId(lastMessageId: string): Observable<Message[]> {
    return this.http.get<Message[]>(SERVER_PATH + '/getBeforeId', {
      params: {
        id: lastMessageId
      }
    });
  }

  getFirstMessage(): Observable<Message> {
    return this.http.get<Message>(SERVER_PATH + '/getFirstMessage');
  }
}

