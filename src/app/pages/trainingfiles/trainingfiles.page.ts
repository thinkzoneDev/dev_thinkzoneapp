import { Component , Input, ViewChild} from '@angular/core';
import {NgModule} from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController} from '@ionic/angular';
import { RestApiService } from './../../rest-api.service';
import { Training2Page } from '../training2/training2.page';
import { DataService } from 'src/app/services/data.service';
import { TranslateConfigService } from './../../translate-config.service';
import {IonSlides} from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-trainingfiles',
  templateUrl: './trainingfiles.page.html',
  styleUrls: ['./trainingfiles.page.scss']
})
@NgModule({
  declarations: [],
  imports: []  
})
export class TrainingFilePage {
  slideOpts :any;
  fileTransfer: FileTransferObject = this.transfer.create();
  links = [];
  storedFiles =[];

  filelist: any = [];
  folderlist: any= [];
  @ViewChild('slider') slider: IonSlides;

  public allmodule_list: any = [];
  public allmodule_name: any[];
  public allsubmodule_list: any = [];
  toolbarshadow = true;
  init_module = '';

  public profile_data: any = [];
  userid: string = '';
  username: string = '';
  usertype: string = '';
  gender: string = '';
  dob: string = '';
  regdate: string = '';
  emailid: string = '';
  contactno: string = '';
  address: string = '';
  bdate;
  bmonth;
  byear;

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  alldata:any;
  hide_class_field = false;
  contentstatus:boolean=false;
  options = {
    slidesPerView: 1.2,
    centeredSlides: true
  };
  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private transfer: FileTransfer,
    public file: File,
    private fileOpener: FileOpener,
    private storage: Storage
  ) {
    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._centerid = '';
    this._centername = '';
    this.getallfiles();
  }
  response:any;
  async getallfiles(){
    await this.api.getallfiles().subscribe(res => {
      this.response = res;
      let value: any = [];
      if(this.response.length <= 0){
        this.filelist = [];
        this.links = [];
        this.contentstatus = true;
      }else{
        this.contentstatus = false;
        this.response.forEach(obj => {
          if(obj.type == 'file'){
            value.push(obj);
          } 
        });
        this.filelist = value;
        this.links = value;
        this.storage.get('storedFiles').then((value) => {
          if(value && value.length > 0 ){
            this.storedFiles = value;
          }else {
            this.storedFiles = [];
          }
          this.applyIcons();
        });
      }
    }, err => {});
  }

  async getfolderlist(){
    await this.api.getdistinctdirectorylistbyapptype('teacherapp').subscribe(res => {
      this.folderlist = res;
    }, err => {});
  }

  folder_clicked(link){
    let navigationExtras: NavigationExtras = { state: { folderobj: link } };
    this.router.navigate(['manager-folderview'], navigationExtras);
  }
  // -----------------------------------
  async  presentLoadingDefault() {
    let loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

  download(path) {
    this.presentLoadingDefault()
    let file_type = path.split('.').pop();
    let file = this.getMIMEtype(file_type);
    const url = path;
    var file_name = new Date().getTime();
    this.fileTransfer.download(url, this.file.dataDirectory + file_name +  '.' + file_type).then((entry) => {
      const storedFile = {
        Hyper_URL:url,
        Native_URL:entry.toURL()
      }
      this.storedFiles.push(storedFile);
      this.storage.set('storedFiles', this.storedFiles).then(() => {
        this.applyIcons();
      });
    
      this.fileOpener.open(entry.toURL(), file)
        .then(() => {})
        .catch(e => {
            this.toaster();
          });
    }, (error) => {
      if(error){
        this.toaster();
      }
    });
  }

  async toaster() {
    const toast = await this.toastCtrl.create({
      message: "You are unable to open this file please download associated application to open this file",
      duration: 3000
    });
    toast.present();
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'aac' : 'audio/aac',
      'abw' : 'application/x-abiword',
      'arc' : 'application/x-freearc',
      'avi' : 'video/x-msvideo',
      'azw' : 'application/vnd.amazon.ebook',
      'bin' : 'application/octet-stream',
      'bmp' : 'image/bmp',
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'eot' : 'application/vnd.ms-fontobject',
      'ico' : 'image/vnd.microsoft.icon',
      'ics' : 'text/calendar',
      'jar' : 'application/java-archive',
      'mid' : 'audio/midi',
      'midi' : 'audio/midi',
      'mjs' : 'text/javascript',
      'mp3' : 'audio/mpeg',
      'mpeg' : 'video/mpeg',
      'mpkg' : 'application/vnd.apple.installer+xml',
      'odp' : 'application/vnd.oasis.opendocument.presentation',
      'ods' : 'application/vnd.oasis.opendocument.spreadsheet',
      'odt' : 'application/vnd.oasis.opendocument.text',
      'oga' : 'audio/ogg',
      'ogv' : 'video/ogg',
      'ogx' : 'application/ogg',
      'otf' : 'font/otf',
      'ppt' : 'application/vnd.ms-powerpoint',
      'pptx' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'rar' : 'application/x-rar-compressed',
      'rtf' : 'application/rtf',
      'sh' : 'application/x-sh',
      'svg' : 'image/svg+xml',
      'swf' : 'application/x-shockwave-flash',
      'tar' : 'application/x-tar',
      'tif' : 'image/tiff',
      'tiff' : 'image/tiff',
      'ttf' : 'font/ttf',
      'vsd' : 'application/vnd.visio',
      'wav' : 'audio/wav',
      'weba' : 'audio/webm',
      'webm' : 'video/webm',
      'webp' : 'image/webp',
      'woff' : 'font/woff',
      'woff2' : 'font/woff2',
      'epub' : 'application/epub+zip',
      'gif' : 'image/gif',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'zip' : 'application/zip',
      '3gp' : 'video/3gpp',
      '3g2' : 'video/3gpp2',
      '7z' : 'application/x-7z-compressed',
      'mp4' : 'video/mp4',
      'flv' : 'video/x-flv',
      'm3u8' : 'application/x-mpegURL',
      'ts':'video/MP2T',
      'mov':'video/quicktime',
      'wmv':'video/x-ms-wmv'
    }
    return MIMETypes[ext];
  }

  openOrDownload(link){
    if(link.stored) this.viewFile(link);
    else this.download(link.filepath)
  }

  viewFile(link){
    let file_type = link.stored_url.split('.').pop();
    let file = this.getMIMEtype(file_type);
    this.fileOpener.open(link.stored_url, file)
    .then(() => {})
    .catch(e => {
        this.toaster();
      });
  }

  applyIcons(){
    for(var l =0; l< (this.links || []).length; l++){
      const http_url = this.links[l];
      const stored = this.storedFiles.find((f) => f.Hyper_URL == http_url.filepath);
      if(stored){
        this.links[l].stored = true;
        this.links[l].stored_url = stored.Native_URL; 
      }else{
        this.links[l].stored = false;
      }
    }
  }

  async  showMsg(){
    const toast = await this.toastCtrl.create({
      message: "This file cannot be deleted",
      duration: 3000
    });
    toast.present();
  }
}
