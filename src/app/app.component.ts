import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MessageService} from './service/message.service';
import {MessageDto} from './dto/MessageDto';
import {Message} from './entity/Message';
import {UserService} from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {
  public firstMessage: Message = new Message();
  public message: MessageDto = new MessageDto();
  public id: number = parseInt(localStorage.getItem('id'));
  public messages: Message[];
  public loaded: boolean = true;
  public newMessages: number = 0;
  @ViewChild('scroll')
  scroll: ElementRef;

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

  ngOnInit(): void {
    if (this.loaded) {
      setTimeout(() => {
        this.focusOnFirstMessage();
        this.loaded = false;
      }, 30);
    }
  }

  ngAfterViewChecked(): void {
    if (this.newMessages < this.messageService.messages.length) {
      this.newMessages++;
      setTimeout(() => {
        this.focusOnFirstMessage();
      });
    }
  }

  sendMessage() {
    this.message.user_id = parseInt(localStorage.getItem('id'));
    this.messageService.sendMessage(this.message);
    this.message.value = '';
    setTimeout(() => {
      this.focusOnFirstMessage();
    }, 30);
  }

  loadMessages() {
    this.messageService.getMessagesBeforeId(this.messages[0].id.toString()).subscribe(ms => {
      ms.forEach(m => this.messages.unshift(m));
    });
    this.scroll.nativeElement.scrollTo(0, 1);
  }

  scrollCheck() {
    if (!this.firstMessage) {
      console.log(this.firstMessage);
      this.messageService.getFirstMessage().subscribe(m => this.firstMessage = m);
    }
    if (this.messages.findIndex(m => m.id === this.firstMessage.id) < 0) {
      if (this.scroll.nativeElement.scrollTop === 0) {
        console.log('loading');
        this.loadMessages();
      }
    }
  }

  focusOnFirstMessage() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }
}
