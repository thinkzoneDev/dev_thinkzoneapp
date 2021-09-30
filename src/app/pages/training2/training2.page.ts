import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from './../../rest-api.service';
import { environment } from 'src/environments/environment.prod';

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// to access sd card
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

// file system access
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

// video player
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';
import { DataService } from 'src/app/services/data.service';
import { QuizPage } from 'src/app/quiz/quiz.page';
import { TranslateConfigService } from './../../translate-config.service';
import { TrainingsubsPage } from 'src/app/trainingsubs/trainingsubs.page';


@Component({
  selector: 'app-training2',
  templateUrl: './training2.page.html',
  styleUrls: ['./training2.page.scss']
})
export class Training2Page {
  baseUrl: string = environment.baseUrl + 'getimage/';
  _userid: string;
  _username: string;

  res: any;
  _id = '';
  _moduleid = '';
  _modulename = '';
  _submoduleid = '';
  _topicid = '';
  _submodulename = '';
  submodulename ='';

  trainingobj: any = {};
  content = '';
  worksheet: any = [];
  video: any = [];
  image: any = [];
  quiz: any = [];
  // hideMe = false;

  sdcard_path = '';
  sdcard_filepath = '';
  doc_filepath_full = '';
  vid_filepath_full = '';


  isVisited_content = false;
  isVisited_video = false;
  isVisited_worksheet = false;
  isVisited_image = false;
  isVisited_quiz = false;

  user_selected_quiz_arr: any = [];
  score = 0;
  totalmark = 0;

  hideSessionSavedTag = true;
  isEnabled_completeActivityButton = false;
  isTrainingSession_alreadySaved = false;

  qryParams: any;
  selected_program = '';
  selected_subject = '';
  selected_month = '';
  selected_week = '';
  selected_activity = '';

  toolbarshadow = true;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private file: File,
    private fileOpener: FileOpener,
    private diagnostic: Diagnostic,
    private videoPlayer: VideoPlayer,
    // public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    public dataServ: DataService
  ) {
    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');

    this.res = {};
    this.res.submodule = this.dataServ.getData('submodule');

    this._id = this.res.submodule._id;
    this._moduleid = this.res.submodule.moduleid;
    this._modulename = this.res.submodule.modulename;
    this._submoduleid = this.res.submodule.submoduleid;
    this._topicid = this.res.submodule.submoduleid;
    this._submodulename = this.res.submodule.submdulename;

    this.getalltrainingcontents(this._moduleid, this._submoduleid);
    this.getTchTraaining_status(this._userid, this._moduleid, this._submoduleid,this._topicid);
  }

  // get training data to show 
  async getalltrainingcontents(moduleid, submoduleid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltrainingcontents(moduleid, submoduleid).subscribe(res => {
        if (res.length > 0) {
          this.trainingobj = res[0];
          this.content = this.trainingobj.content;
          this.worksheet = this.trainingobj.worksheet;
          this.video = this.trainingobj.video;
          this.image = this.trainingobj.flashcard;
          this.quiz = this.trainingobj.quiz;
          this.submodulename = this.trainingobj.submodulename;

          // mark scrollable content as visited
          this.isVisited_content = true;
          this.isVisited_image = true;
        }
        loading.dismiss();
      }, err => {
        loading.dismiss();
      });
  }
  
  // for checking the specific activity is already saved by this user or not
  async getTchTraaining_status(uid, mid, sid,tid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.gettchtrainingdetails(uid, mid, sid,tid).subscribe(res => {
        if (res.length > 0) {
          this.isTrainingSession_alreadySaved = true;
          this.hideSessionSavedTag = false;
        } else {
          this.isTrainingSession_alreadySaved = false;
          this.hideSessionSavedTag = true;
        }
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  // video button clicked
  async play_video(video_file) {
    // alert('Now Orientation: '+this.screenOrientation.type); // logs the current orientation, example: 'landscape'

    // set to landscape
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    this.vid_filepath_full = this.sdcard_filepath + '/' + video_file;
    // alert('Selected video: '+this.vid_filepath_full);
    const voption: VideoOptions = {
      volume: 0.5, scalingMode: 2
    };
    // alert(this.vid_filepath_full);
    this.videoPlayer.play(this.vid_filepath_full, voption).then(() => {
        // alert('Video completed !!!');
        this.isVisited_video = true;
        // this.Enable_CompleteActivityButton();

        // set to portrait
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      }).catch(e => {
        alert(JSON.stringify(e));
        // set to portrait
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      });
      // set to portrait
      // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }
  
  // work-sheet button clicked
  async open_document(document_file) {
    const n = document_file.lastIndexOf('/');
    const str1 = document_file.substring(0, n);
    const str2 = document_file.substring(n + 1, document_file.length);
    const filename = str2,
    file_ext = 'pdf',
    filename_new = Date.now(),
    file_type = 'application/pdf';

    this.doc_filepath_full = this.sdcard_filepath + '/' + str1;
    // alert('### doc file path: '+this.doc_filepath_full);
    // this.showAlert('file.externalApplicationStorageDirectory','',''+this.file.externalApplicationStorageDirectory);
    // alert('source: '+this.doc_filepath_full+'    --    filenmae:  '+filename+'    --    destin: '+this.file.externalApplicationStorageDirectory+'/files');

    // copy file and show
    this.file.copyFile(this.doc_filepath_full, filename, this.file.externalApplicationStorageDirectory + '/files', filename_new + '.' + file_ext).then(result => {
      this.fileOpener.open(result.nativeURL, file_type)
        .then(() => {
          this.isVisited_worksheet = true;
          // this.Enable_CompleteActivityButton();
        }).catch(e => alert('Error opening file' + JSON.stringify(e)));
    }).catch(e => alert('Error copying file' + JSON.stringify(e)));
  }

  // quiz button clicked
  async open_quiz() {
    this.dataServ.setData('quiz', this.quiz);
    
    const modal = await this.modalController.create({
      component: QuizPage
    });
    modal.onDidDismiss().then((res: any) => {
      let data = res.data;
      if (data.isComplete) {
        this.user_selected_quiz_arr = data.quiz;
        this.totalmark = data.totalScore;
        this.score = data.score;
      } else {
        this.user_selected_quiz_arr = [];
      }
    });
    return await modal.present();
  }

  async complete_activity() {
    if (this.isTrainingSession_alreadySaved) {
      this.showAlert('Info', '', 'Training session already submitted');
    } else {
      if (this.user_selected_quiz_arr.length <= 0) {
        this.showAlert('Quiz not complete', '', 'Please complete quiz before saving');
      } 
      /* else if (this.video.length > 0 && !this.isVisited_video) {
         this.showAlert('Videos not viewed', '', 'Please view videos before saving');
      }*/ 
      else {
        this.save();
      }
    }
  }

  async save() {
    const body = {
      userid : this._userid,
      username : this._username,
      moduleid : this._moduleid,
      modulename : this._modulename,
      submoduleid : this._submoduleid,
      submodulename : this._submodulename,
      content: '',
      content_status : true,
      flashcard: this.image,
      flashcard_status : true,
      worksheet: '',
      worksheet_status : true,
      video: '',
      video_status : true,
      quiz: this.user_selected_quiz_arr,
      quiz_status : true,
      score: this.score,
      totalmark: this.totalmark
    };
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.savetchtraining(body).subscribe(res => {
        this.showAlert('Training Session', '', 'Training session save ' + JSON.stringify(res.status));
        loading.dismiss();
        //this.navController.back();
        this.navController.navigateBack('training1');
      }, err => {
        loading.dismiss();
      });
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }

  // alert box
  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
