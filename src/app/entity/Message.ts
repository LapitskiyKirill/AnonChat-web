import {User} from './User';

export class Message {
  // tslint:disable-next-line:variable-name
  constructor() {
  }

  id: number;
  // tslint:disable-next-line:variable-name
  user: User = new User();
  value: string;
}
