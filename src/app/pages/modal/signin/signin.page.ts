import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { RestApiService } from './../../../rest-api.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  public signinFormGroup: FormGroup;
  _status: boolean = true;
  _message: string = '';
  fcm_token: string = localStorage.getItem('fcm_token');
  fcm_rtoken: string = localStorage.getItem('fcm_rtoken');

  @Input() value: any;
  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public api: RestApiService,
  ) {
    this.signinFormGroup = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.signinFormGroup = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async signin() {
    this._status = true;
    let data = {
      userid: this.signinFormGroup.value.email,
      password: this.signinFormGroup.value.password,
      usertype: 'teacher'
    }
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.authenticateuser(data)
      .subscribe(res => {
        loading.dismiss();
        if(res['success'] == 'success'){
          this._status = true;
          this._message = "";

          let uid = res['userid'];
          let uname = res['username'];
          localStorage.setItem('_regdate', res['regdate']);
          localStorage.setItem('_userid', res['userid']);
          localStorage.setItem('_username', res['username']);
          localStorage.setItem('_emailid', res['emailid']);
          // set log in time
          localStorage.setItem("_login_time",(new Date()).toISOString());
          // save token id -----------------------------------
          this.api.getfcmtokenidbyuserid(uid)
          .subscribe(res1 => {
            if(res1.length > 0){
              let tid = res1[0]['_id']
              const obj = {
                userid: uid,
                username: uname,
                token: this.fcm_token,
                refresh_token: this.fcm_rtoken
              }
              this.api.updatefcmtokenid(tid, obj).subscribe(res2 => {
              });
            }else{
              const obj = {
                userid: uid,
                username: uname,
                token: this.fcm_token,
                refresh_token: this.fcm_rtoken
              }
              this.api.createnewfcmtokenid(obj).subscribe(res3 => {
                console.log("res3",res3)
              });
            }            
          }, err => {
            this._status = false;
              this._message = "Connection error !!!";
            loading.dismiss();
          });
          // -------------------------------------------------
          this.modalController.dismiss();
          this.navController.navigateRoot('/home-results');
          this.closeModal();
        }else{
          this._status = false;
          this._message = "Invalid credentials !!!";
        }            
      }, err => {
        this._status = false;
          this._message = "Connection error !!!";
        loading.dismiss();
      });
  }
}
