import { Component } from "@angular/core";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { Router } from "@angular/router";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";
import {
  DocumentViewer,
  DocumentViewerOptions,
} from "@ionic-native/document-viewer/ngx";
import { Storage } from "@ionic/storage";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  IonMenu,
} from "@ionic/angular";
import { HblPdfviewerPage } from "../hbl-pdfviewer/hbl-pdfviewer.page";
import { TranslateService } from "@ngx-translate/core";
import { RestApiService } from "../../rest-api.service";
import { from } from "rxjs";
import { ServerDownService } from "src/app/services/server-down.service";

@Component({
  selector: "app-hbl-activity",
  templateUrl: "./hbl-activity.page.html",
  styleUrls: ["./hbl-activity.page.scss"],
})
export class HblActivityPage {
  respons: any;
  main_arr: any = [];
  userid: any;
  selectedLanguage: string;
  fileTransfer: FileTransferObject = this.transfer.create();
  links = [];
  storedFiles = [];
  filelist: any = [];
  folderlist: any = [];
  toolbarshadow = true;
  DocumentViewerOptions: any;
  success_message: string = "";
  value: any;
  no_file: boolean;

  constructor(
    public router: Router,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private transfer: FileTransfer,
    public file: File,
    private fileOpener: FileOpener,
    private storage: Storage,
    private document: DocumentViewer,
    private translateService: TranslateService,
    private serverDownMsg: ServerDownService
  ) {
    this.success_message =
      this.translateService.get(".success_message")["value"];
    this.userid = localStorage.getItem("_userid");
    this.selectedLanguage = localStorage.getItem("_language");
    this.getAllFileList();
  }

  async getAllFileList() {
    await this.api.getactivitydocument("hbl").subscribe(
      (res) => {
        this.folderlist = res;
        let value: any = [];
        if (res.length <= 0) {
          this.filelist = [];
          this.links = [];
          this.no_file = true;
        } else {
          res.forEach((element) => {
            if (element.student_type == "hbl") value.push(element);
          });
          this.filelist = value;
          this.links = value;
          this.no_file = false;
          this.storage.get("storedFiles").then((value) => {
            if (value && value.length > 0) {
              this.storedFiles = value;
            } else {
              this.storedFiles = [];
            }
            this.applyIcons();
          });
        }
      },
      (err) => {
        this.serverDownMsg.presentToast();
      }
    );
  }

  async presentLoadingDefault() {
    let loading = await this.loadingController.create({
      message: "Please wait...",
      duration: 3000,
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

  download(path) {
    this.presentLoadingDefault();
    let file_type = path.split(".").pop();
    let file = this.getMIMEtype(file_type);
    const url = path;
    var file_name = new Date().getTime();
    this.fileTransfer
      .download(url, this.file.dataDirectory + file_name + "." + file_type)
      .then(
        (entry) => {
          const storedFile = {
            Hyper_URL: url,
            Native_URL: entry.toURL(),
          };
          this.storedFiles.push(storedFile);
          this.storage.set("storedFiles", this.storedFiles).then(() => {
            this.applyIcons();
          });

          this.fileOpener
            .open(entry.toURL(), file)
            .then(() => {})
            .catch((e) => {
              this.toaster();
            });
        },
        (error) => {
          if (error) {
            this.toaster();
          }
        }
      );
  }

  applyIcons() {
    for (var l = 0; l < (this.links || []).length; l++) {
      const http_url = this.links[l];
      const stored = this.storedFiles.find(
        (f) => f.Hyper_URL == http_url.s3path
      );
      if (stored) {
        this.links[l].stored = true;
        this.links[l].stored_url = stored.Native_URL;
      } else {
        this.links[l].stored = false;
      }
    }
  }

  open() {
    this.fileOpener
      .open("assets/img/hbl/1620470252059.pdf", "application/pdf")
      .then(() => console.log("File is opened"))
      .catch((e) => console.log("Error openening file", e));
  }

  async toaster() {
    const toast = await this.toastCtrl.create({
      message:
        "You are unable to open this file please download associated application to open this file",
      duration: 3000,
    });
    toast.present();
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      txt: "text/plain",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc: "application/msword",
      pdf: "application/pdf",
      jpg: "image/jpeg",
      bmp: "image/bmp",
      png: "image/png",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      rtf: "application/rtf",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    return MIMETypes[ext];
  }

  downloadViewPdf(link) {
    if (link.stored) this.viewFile(link);
    else this.download(link.activitydocument);
  }

  viewFile(link) {
    let file_type = link.stored_url.split(".").pop();
    let file = this.getMIMEtype(file_type);
    this.fileOpener
      .open(link.stored_url, file)
      .then(() => {})
      .catch((e) => {
        this.toaster();
      });
  }

  async showMsg() {
    const toast = await this.toastCtrl.create({
      message: "This file cannot be deleted",
      duration: 3000,
    });
    toast.present();
  }

  async openPdfviewer(link_list) {
    this.value = link_list;
    const modal = await this.modalCtrl.create({
      component: HblPdfviewerPage,
      componentProps: {
        res: {
          link: this.value.activitydocument,
        },
      },
    });

    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
