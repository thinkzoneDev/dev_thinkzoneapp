import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserprofileimageService {
  user_profile_image: string = '/assets/img/default-user-profile-image.jpg';    // default user image

  constructor() {
    this.user_profile_image = (localStorage.getItem('_image') == undefined || localStorage.getItem('_image') == null || localStorage.getItem('_image') == '' || localStorage.getItem('_image') == "undefined") ? this.user_profile_image : localStorage.getItem('_image');
  }

  getuserprofileimage(){
    this.user_profile_image = (localStorage.getItem('_image') == undefined || localStorage.getItem('_image') == null || localStorage.getItem('_image') == '' || localStorage.getItem('_image') == "undefined") ? this.user_profile_image : localStorage.getItem('_image');
    return this.user_profile_image;
  }
}
