import {Component} from '@angular/core';
import {MessageService} from './service/message.service';
import {MessageDto} from './dto/MessageDto';
import {Message} from './entity/Message';
import {UserService} from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public firstMessage: Message;
  public message: MessageDto = new MessageDto();
  public id: number = parseInt(localStorage.getItem('id'));
  public messages: Message[];
  public isFirstMessage = false;
  public haveNewMessages = true;

  constructor(public messageService: MessageService,
              public userService: UserService) {
    if (!localStorage.getItem('id')) {
      userService.register().subscribe(id => localStorage.setItem('id', id.toString()));
      this.id = parseInt(localStorage.getItem('id'));
    }
    messageService.getMessages().subscribe(ms => {
      ms.reverse();
      this.messages = ms;
    });
    messageService.getFirstMessage().subscribe(m => this.firstMessage = m);
  }

  sendMessage() {
    this.message.user_id = parseInt(localStorage.getItem('id'));
    this.messageService.sendMessage(this.message);
    this.message.value = '';
    console.log(this.messageService.messages);
  }

  loadMessages() {
    this.messageService.getMessagesBeforeId(this.messages[0].id.toString()).subscribe(ms => {
      ms.forEach(m => this.messages.unshift(m));
    });
    document.getElementsByTagName('div')[2].scrollTo(0, 1);
  }

  scrollcheck() {
    if (!this.isFirstMessage) {
      if (this.messages.findIndex(m => m.id === this.firstMessage.id) < 0) {
        if (document.getElementsByClassName('message')[0].scrollTop === document.getElementsByClassName('content')[0].scrollTop) {
          this.loadMessages();
        }
      }
    }
  }

  focusOnFirstMessage() {
    document.getElementsByTagName('div')[2].scrollTo(0, document.getElementsByTagName('div')[2].scrollHeight);
    this.haveNewMessages = false;
  }
}
