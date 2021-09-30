import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";
import { Storage } from "@ionic/storage";
import {
  ToastController,
  LoadingController,
  ModalController,
  NavParams,
} from "@ionic/angular";

import {
  PDFProgressData,
  PdfViewerComponent,
  PDFDocumentProxy,
  PDFSource,
} from "ng2-pdf-viewer";

@Component({
  selector: "app-hbl-pdfviewer",
  templateUrl: "./hbl-pdfviewer.page.html",
  styleUrls: ["./hbl-pdfviewer.page.scss"],
})
export class HblPdfviewerPage implements OnInit {
  toolbarshadow = true;
  res: any;
  totalPages: number;
  page: number = 1;
  link: string;
  isLoaded: boolean = false;
  links = [];
  zoom: number = 1.0;
  originalSize: boolean = true;
  storedFiles = [];
  error: any;
  fileTransfer: FileTransferObject = this.transfer.create();
  progressData: PDFProgressData;
  prg: any = "";

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private loadingController: LoadingController,
    public file: File,
    private storage: Storage,
    private _zone: NgZone
  ) {
    this.res = this.navParams.data.res;
    this.link = this.res.link;
  }

  ngOnInit() {}

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
          this.storage.set("storedFiles", this.storedFiles).then(() => {});

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

  async presentLoadingDefault() {
    let loading = await this.loadingController.create({
      message: "Please wait... " + this.prg,
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
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

  downloadViewPdf(path) {
    this.download(path);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  //ON progress of pdf
  onProgress(progressData: PDFProgressData) {
    this.isLoaded = false;
    this._zone.run(() => {
      var perc = Math.floor((progressData.loaded / progressData.total) * 100);
      this.prg = "" + perc + "%";
      if (perc == 100) this.isLoaded = true;
    });

    this.progressData = progressData;

    this.error = null;
  }

  onError(error: any) {
    this.error = error;
  }
}
