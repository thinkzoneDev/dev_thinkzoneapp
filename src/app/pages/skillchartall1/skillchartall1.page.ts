import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  ActionSheetController } from '@ionic/angular';
  
import { RestApiService } from './../../rest-api.service';
import { NetworkService, ConnectionStatus } from './../../services/network.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Router, NavigationExtras } from '@angular/router';

// File Download Imports
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx'; 
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DataService } from 'src/app/services/data.service';

// File Opener
import { FileOpener } from '@ionic-native/file-opener/ngx';

// NgZone is imported to show increasing download progress ref: https://forum.ionicframework.com/t/when-the-file-is-downloaded-i-want-to-show-progress-bar/124244/14
import {NgZone} from '@angular/core';
import { SkillchartTablePage } from '../skillchart-table/skillchart-table.page';


@Component({
  selector: 'app-skillchartall1',
  templateUrl: './skillchartall1.page.html',
  styleUrls: ['./skillchartall1.page.scss']
})
export class Skillchartall1Page {
  fileTransferObj: FileTransferObject; 
  dlprogress: string = '';

  cloud_fileurl: string = '';
  cloud_fileurl_ece: string = '';
  cloud_fileurl_pgemath: string = '';
  cloud_fileurl_pgeeng: string = '';
  cloud_fileurl_pgeodia: string = '';

  local_rootpath: string = '';
  local_directory: string = '';

  local_filename: string = '';
  local_filename_ece: string = '';
  local_filename_pgemath: string = '';
  local_filename_pgeeng: string = '';
  local_filename_pgeodia: string = '';

  local_filepath_full: string = '';
  local_filepath_ece: string = '';
  local_filepath_pgemath: string = '';
  local_filepath_pgeeng: string = '';
  local_filepath_pgeodia: string = '';

  _preferedlanguage: string = '';
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  selected_program: string = '';
  selected_subject: string = '';
  selected_month: string = '';
  seleted_level: string ='';
  months = [];
  levels = [];

  tabledata: any = [];
  arrr: any = [];
  answer: any = [];
  hide_subject_select: boolean = false;

  rows: any = [];
  columns: any = [];
  public assessmenttest = [];
  public studentname;
  user_selected_tbl_arr: any;

  url_skillchartfile_ece: string = '';
  url_skillchartfile_pgemath: string = '';
  url_skillchartfile_pgeeng: string = '';
  url_skillchartfile_pgeodia: string = '';
  
  displayname_skillchartfile_ece: string = '';
  displayname_skillchartfile_pgemath: string = '';
  displayname_skillchartfile_pgeeng: string = '';
  displayname_skillchartfile_pgeodia: string = '';

  hide_dlprogressdiv: boolean = true;
  
  
  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private file: File,
    private fileOpener: FileOpener,
    private fileTransfer: FileTransfer,
    private screenOrientation: ScreenOrientation,
    public _zone: NgZone, 
    private router: Router,
    public dataServ: DataService,
    public actionSheetController : ActionSheetController,
    private networkService: NetworkService 
  ) {
    this._preferedlanguage = localStorage.getItem('_language');
    this._userid = localStorage.getItem('_userid');
    //console.log('--> _preferedlanguage: '+this._preferedlanguage+'    _userid: '+this._userid);

    this.local_rootpath = this.file.externalDataDirectory;
    this.local_directory = 'resources';

    this.cloud_fileurl          = 'https://shared001.s3.us-east-2.amazonaws.com/skillchart_full.pdf';
    this.cloud_fileurl_ece      = 'https://shared001.s3.us-east-2.amazonaws.com/skillchart_file_ece.pdf';
    this.cloud_fileurl_pgemath  = 'https://shared001.s3.us-east-2.amazonaws.com/skillchart_file_pge_math.pdf';
    this.cloud_fileurl_pgeeng   = 'https://shared001.s3.us-east-2.amazonaws.com/skillchart_file_pge_eng.pdf';
    this.cloud_fileurl_pgeodia  = 'https://shared001.s3.us-east-2.amazonaws.com/skillchart_file_pge_odia.pdf';

    this.local_filename         = /[^/]*$/.exec(this.cloud_fileurl)[0];
    this.local_filename_ece     = /[^/]*$/.exec(this.cloud_fileurl_ece)[0];
    this.local_filename_pgemath = /[^/]*$/.exec(this.cloud_fileurl_pgemath)[0];
    this.local_filename_pgeeng  = /[^/]*$/.exec(this.cloud_fileurl_pgeeng)[0];
    this.local_filename_pgeodia = /[^/]*$/.exec(this.cloud_fileurl_pgeodia)[0];

    this.local_filepath_full    = this.local_rootpath+'/'+this.local_directory+'/'+this.local_filename;
    this.local_filepath_ece     = this.local_rootpath+'/'+this.local_directory+'/'+this.local_filename_ece;
    this.local_filepath_pgemath = this.local_rootpath+'/'+this.local_directory+'/'+this.local_filename_pgemath;
    this.local_filepath_pgeeng  = this.local_rootpath+'/'+this.local_directory+'/'+this.local_filename_pgeeng;
    this.local_filepath_pgeodia = this.local_rootpath+'/'+this.local_directory+'/'+this.local_filename_pgeodia;
    
    this.dlprogress= '';
    this.hide_dlprogressdiv = true;
    this.fetchfileurls();
  }

  fetchfileurls(){
    this.geteceskillchartfileuploaddetails();
    this.getpgemathskillchartfileuploaddetails();
    this.getpgeengskillchartfileuploaddetails();
    this.getpgeodiaskillchartfileuploaddetails();
  }

  // get ece file url
  async geteceskillchartfileuploaddetails() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.geteceskillchartfileuploaddetails().subscribe(res => {
        if(Object.keys(res).length > 0) {
          this.displayname_skillchartfile_ece = res[0].displayname; 
          this.url_skillchartfile_ece = res[0].fileurl;
        }else {
          this.displayname_skillchartfile_ece = 'NA'; 
          this.url_skillchartfile_ece = '';
        }
        loading.dismiss();
      }, err => { console.log(JSON.stringify(err)); loading.dismiss();});
  }

  // get pge math file url
  async getpgemathskillchartfileuploaddetails() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getpgemathskillchartfileuploaddetails().subscribe(res => {
        if(Object.keys(res).length > 0) {
          this.displayname_skillchartfile_pgemath = res[0].displayname; 
          this.url_skillchartfile_pgemath = res[0].fileurl;
        }else {
          this.displayname_skillchartfile_pgemath = 'NA';  
          this.url_skillchartfile_pgemath = '';
        }
        loading.dismiss();
      }, err => { console.log(JSON.stringify(err)); loading.dismiss();});
  }

  // get pge eng file url
  async getpgeengskillchartfileuploaddetails() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getpgeengskillchartfileuploaddetails().subscribe(res => {
        if(Object.keys(res).length > 0) {
          this.displayname_skillchartfile_pgeeng = res[0].displayname;
          this.url_skillchartfile_pgeeng = res[0].fileurl;
        }else {
          this.displayname_skillchartfile_pgeeng = 'NA';  
          this.url_skillchartfile_pgeeng = '';
        }
        loading.dismiss();
      }, err => { console.log(JSON.stringify(err)); loading.dismiss();});
  }

  // get pge odia file url
  async getpgeodiaskillchartfileuploaddetails() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getpgeodiaskillchartfileuploaddetails().subscribe(res => {
        if(Object.keys(res).length > 0) {
          this.displayname_skillchartfile_pgeodia = res[0].displayname;  
          this.url_skillchartfile_pgeodia = res[0].fileurl;
        }else {
          this.displayname_skillchartfile_pgeodia = 'NA';  
          this.url_skillchartfile_pgeodia = '';
        }
        loading.dismiss();
      }, err => { console.log(JSON.stringify(err)); loading.dismiss();});
  }
  
  

  program_select_click(value){
    this.selected_program = value;
    if(this.selected_program == 'ece'){
      this.hide_subject_select = true;
      this.selected_subject = 'na';
    }else{
      this.hide_subject_select = false;
      this.selected_subject = '';
    }
    this.load_data(this.selected_program, this.selected_month, this.seleted_level, this.selected_subject);
  }
  subject_select_click(value){
    this.selected_subject = value;
    this.load_data(this.selected_program, this.selected_month, this.seleted_level, this.selected_subject);
  }
  month_select_click(value){
    this.selected_month = value;
    this.load_data(this.selected_program, this.selected_month, this.seleted_level, this.selected_subject);
  }
  level_select_click(value){
    this.seleted_level = value;
    this.load_data(this.selected_program, this.selected_month, this.seleted_level, this.selected_subject);
  }

  load_data(program, month, level, subject){
    if(  program == undefined || program == null || program == ''
      || subject == undefined || subject == null || subject == ''
      || month == undefined   || month == null   || month == ''
      || level == undefined   || level == null   || level == ''
    ){
      return;
    }else{
      localStorage.setItem('program',program);
      localStorage.setItem('month',month);
      localStorage.setItem('level',level);
      localStorage.setItem('subject',subject);
      this.get_details(program, month, level, subject);
    }
  }

  async get_details(program, month, level, subject) {
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    const loading = await this.loadingController.create({});
    await loading.present();
    
    await this.api.gettchassessment(this._preferedlanguage, program, level, month, subject)
      .subscribe(res1 => {
        this.api.gettchassessmenttest_all(this._userid, program, level, month, subject)
        .subscribe(res2 => {
          this.set_rows_columns(res1, res2);
          loading.dismiss();
        }, err => {
          loading.dismiss();
        });
        
        loading.dismiss();
      }, err => {
        loading.dismiss();
      });
  }

  set_rows_columns(masterdata, fulldata){
    let arr1 = [];
    let arr2 = [];
   
    arr1.push('Name');
    masterdata.forEach(element2 => {
      arr1.push(element2.question);
    });
    this.arrr.push(arr1);
    arr2.push(arr1);
    fulldata.forEach(element1 => {
      arr1 = [];
       this.studentname = element1['studentname'];
       this.answer.push(this.studentname);
       this.assessmenttest = element1['assessmenttest'];
      arr1.push(this.studentname);
      masterdata.forEach(element2 => {
        this.assessmenttest.forEach(element3 => {
          if(element2.id == element3.id)
            arr1.push(element3.answer);
            this.answer.push(element3.answer);
        });
      });
      
        
      arr2.push(arr1);
    });
    this.tabledata = arr2;
    // this.open_skillchart();
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  async open_skillchart() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.dataServ.setData('tabledata', this.tabledata);
 
    const modal = await this.modalController.create({
      component: SkillchartTablePage
    });
    modal.onDidDismiss()
      .then((data: any) => {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        if (data.isComplete) {
          this.user_selected_tbl_arr = this.tabledata;
        } else {
          this.user_selected_tbl_arr = [];
        }
    });
    return await modal.present();
  }
  // close modal
closeModal() {
  this.modalController.dismiss({data: 'Cancel'});
  this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
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
  // confirm box
  async showConfirm(header: string, subHeader: string, message: string, body: any) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }

  // download file
  async show_file(){
    /*let url = encodeURI(this.cloud_fileurl);
    this.fileTransferObj = this.fileTransfer.create();  

    // check if file is exist locally else download
    this.file.checkDir(this.local_rootpath, this.local_directory)
      .then(_ => this.file.checkFile(this.local_rootpath, this.local_directory+'/'+ this.local_filename)
			  .then(_ => {
          this.open_file();
        })
        .catch(err => this.download_file(url)))
		  .catch(err => this.file.createDir(this.local_rootpath, this.local_directory, false)
			  .then(response => this.download_file(url) )
        .catch(err => alert('It was not possible to create Directory. Err: ' + JSON.stringify(err)))			
    );
    */
     
    const actionSheet = await this.actionSheetController.create({
      header: 'DOWNLOAD SKILLCHART',
      buttons: [{
        text: 'ECE: '+this.displayname_skillchartfile_ece,
        icon: 'paper',
        handler: () => {
          this.cloud_fileurl = this.url_skillchartfile_ece;
          let url = encodeURI(this.cloud_fileurl);

          if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
            this.open_file(this.local_filepath_ece);
          }else{
            this.download_file(url, this.local_filepath_ece);
          }
        }
      }, {
        text: 'PGE MATH: '+this.displayname_skillchartfile_pgemath,
        icon: 'paper',
        handler: () => {
          this.cloud_fileurl = this.url_skillchartfile_pgemath;
          let url = encodeURI(this.cloud_fileurl);
          if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
            this.open_file(this.local_filepath_pgemath);
          }else{
            this.download_file(url, this.local_filepath_pgemath);
          }
        }
      }, {
        text: 'PGE ENGLISH: '+this.displayname_skillchartfile_pgeeng,
        icon: 'paper',
        handler: () => {
          this.cloud_fileurl = this.url_skillchartfile_pgeeng;
          let url = encodeURI(this.cloud_fileurl);
          if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
            this.open_file(this.local_filepath_pgeeng);
          }else{
            this.download_file(url, this.local_filepath_pgeeng);
          }
        }
      }, {
        text: 'PGE ODIA: '+this.displayname_skillchartfile_pgeodia,
        icon: 'paper',
        handler: () => {
          this.cloud_fileurl = this.url_skillchartfile_pgeodia;
          let url = encodeURI(this.cloud_fileurl);
          if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
            this.open_file(this.local_filepath_pgeodia);
          }else{
            this.download_file(url, this.local_filepath_pgeodia);
          }
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }
  
  async download_file(_url, filepath){
    this.hide_dlprogressdiv = false;
    let url = encodeURI(_url);  
    this.fileTransferObj = this.fileTransfer.create(); 

    this.fileTransferObj.onProgress((progressEvent) => {
      this._zone.run(() =>{
        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        this.dlprogress = perc+' %';
      });
    });

    this.fileTransferObj.download(url, filepath)
      .then((entry) => {
        this.dlprogress ='Download complete';
        this.open_file(filepath);
      })
      .catch((err) =>{
        this.dlprogress= '';
        this.hide_dlprogressdiv = true;
        alert('Error saving file: ' + JSON.stringify(err));
      })
  }

  async open_file(filepath){
    this.dlprogress= '';
    this.hide_dlprogressdiv = true;
    //this.local_filepath_full = this.local_rootpath+'/'+this.local_directory+'/'+this.local_filename;
    this.fileOpener.open(filepath, 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => {
          alert('File Not Found !!!');
        });
  } 
}
