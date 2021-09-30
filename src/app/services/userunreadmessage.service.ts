import { Injectable } from '@angular/core';
import { RestApiService } from '.././rest-api.service';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class UserUnreadMessageService {
  user_unread_message: any;    // default user image
  unreadcount:any;
  constructor(public api: RestApiService,private http: HttpClient) {
  }
  getuserunreadMessage() {
		return this.http.get(baseUrl+'getunreadmessage/'+localStorage.getItem('_userid'),
		{
			headers: new HttpHeaders().set('Content-Type', 'application/json')
			// responseType: 'text'
		});
  }
  updateuserunreadmessage() {
    // this.getuserunreadMessage()
  }

}

