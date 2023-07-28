import { Component, OnInit } from "@angular/core";
import { DataService, DataObject } from "src/app/services/data.service";

// File Download Imports
import { File } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

// File Opener
import { FileOpener } from "@ionic-native/file-opener/ngx";

// Video Player
import { VideoOptions, VideoPlayer } from "@ionic-native/video-player/ngx";
// NgZone is imported to show increasing download progress ref: https://forum.ionicframework.com/t/when-the-file-is-downloaded-i-want-to-show-progress-bar/124244/14
import { NgZone } from "@angular/core";

@Component({
  selector: "app-file-display",
  templateUrl: "./file-display.page.html",
  styleUrls: ["./file-display.page.scss"],
})
export class FileDisplayPage implements OnInit {
  fileTransferObj: FileTransferObject;
  dlprogress: string = "";
  file_index: number = 0;

  sdcard_path = "";
  sdcard_filepath = "";
  doc_filepath_full = "";
  vid_filepath_full = "";

  selected_program = "";
  selected_subject = "";
  selected_month = "";
  selected_week = "";
  selected_activity = "";

  isVisited_video = false;
  isVisited_worksheet = false;

  toolbarshadow = true;
  page_title = "Video Contents";
  icon = "play";
  type = "video";
  doc_path_list: DataObject[] = [
    { path: "asd", played: false },
    { path: "asd", played: false },
  ];

  constructor(
    private videoPlayer: VideoPlayer,
    private dataService: DataService,
    private file: File,
    private fileOpener: FileOpener,
    private fileTransfer: FileTransfer,
    public _zone: NgZone
  ) {
    this.doc_path_list = dataService.getDocumentData();
    if (this.dataService.getData("page_title") != null) {
      this.page_title = this.dataService.getData("page_title");
    }
    if (this.dataService.getData("type") === "video") {
      this.icon = "play";
      this.type = "video";
    } else {
      this.icon = "document";
      this.type = "sheet";
    }
  }

  ngOnInit() {}

  async file_btn_click(file_obj, file_index) {
    this.file_index = file_index;
    this.dlprogress = "";

    //let file_url = file_obj.path;
    let file_url = file_obj.path.s3path;
    let url = encodeURI(file_url);
    //let fileName = /[^/]*$/.exec(file_url)[0];
    let fileName = file_obj.path.displayname;
    let local_directory = "resources";
    this.fileTransferObj = this.fileTransfer.create();

    // check if file is exist locally else download
    this.file
      .checkDir(this.file.externalDataDirectory, local_directory)
      .then((_) =>
        this.file
          .checkFile(
            this.file.externalDataDirectory,
            local_directory + "/" + fileName
          )
          .then((_) => {
            //alert("A file with the same name already exists!");
            this.open_file(
              this.file.externalDataDirectory +
                "/" +
                local_directory +
                "/" +
                fileName
            );
          })
          .catch((err) =>
            this.fileTransferProcess(
              url,
              this.file.externalDataDirectory +
                "/" +
                local_directory +
                "/" +
                fileName
            )
          )
      )
      .catch((err) =>
        this.file
          .createDir(this.file.externalDataDirectory, local_directory, false)
          .then((response) => {
            //alert('New folder created:  ' + response.fullPath);
            this.fileTransferProcess(
              url,
              this.file.externalDataDirectory +
                "/" +
                local_directory +
                "/" +
                fileName
            );
          })
          .catch((err) => {
            alert(
              "It was not possible to create Directory. Err: " +
                JSON.stringify(err)
            );
          })
      );
  }

  async fileTransferProcess(_url, filePath) {
    let url = encodeURI(_url);
    this.fileTransferObj = this.fileTransfer.create();

    this.fileTransferObj.onProgress((progressEvent) => {
      this._zone.run(() => {
        var perc = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        this.dlprogress = perc + " %";
        //this.dlprogress = progressEvent.loaded+'/'+progressEvent.total;
      });
    });

    this.fileTransferObj
      .download(url, filePath)
      .then((entry) => {
        //alert('File saved in:  ' + entry.nativeURL);
        this.dlprogress = "Download complete";
      })
      .catch((err) => {
        alert("Error saving file: " + JSON.stringify(err));
      });
  }

  async open_file(file_full_path) {
    if (this.type == "video")
      this.play_video({ path: file_full_path, played: false });
    else this.open_document({ path: file_full_path, played: false });
  }

  // play video button click
  async play_video(data: { path: string; played: boolean }) {
    this.vid_filepath_full = data.path;

    // ===== For playing video in Ionic Native Video Player =====
    /*
    const voption: VideoOptions = {
      volume: 0.5,
      scalingMode: 0.5
    };
    this.videoPlayer.play(this.vid_filepath_full, voption).then(() => {
      data.played = true;
      // this.Enable_CompleteActivityButton();
    }).catch(e => {
      alert(JSON.stringify(e));
    });*/

    // ===== For playing video in System Default Video Player =====
    this.fileOpener
      .open(this.vid_filepath_full, "video/mp4")
      .then(() => {
        data.played = true;
      })
      .catch((e) => alert("Error opening file" + JSON.stringify(e)));
  }

  // open document button click
  async open_document(data: DataObject) {
    // data.path contains this.sdcard_filepath + '/THINKZONE/PGE/' + this.selected_subject.toLocaleUpperCase() + '/WORKSHEET'
    this.doc_filepath_full = data.path;

    this.fileOpener
      .open(this.doc_filepath_full, "application/pdf")
      .then(() => {
        data.played = true;
        // this.isVisited_worksheet = true;
        // this.Enable_CompleteActivityButton();
      })
      .catch((e) => alert("Error opening file" + JSON.stringify(e)));

    /* const filename_new = Date.now();
    // copy file and show
    this.file.copyFile( this.doc_filepath_full, data.file_name,
                        this.file.externalApplicationStorageDirectory + '/files',
                        filename_new + '.pdf').then(result => {
      this.fileOpener.open(result.nativeURL, 'application/pdf')
        .then(() => {
          data.played = true;
          // this.isVisited_worksheet = true;
          // this.Enable_CompleteActivityButton();
        }).catch(e => alert('Error opening file' + JSON.stringify(e)));
    }).catch(e => alert('Error copying file' + JSON.stringify(e))); */
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
}
