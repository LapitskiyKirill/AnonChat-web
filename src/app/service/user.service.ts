import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SERVER_PATH} from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  register() {
    return this.http.get(SERVER_PATH + '/user/register');
  }
}
