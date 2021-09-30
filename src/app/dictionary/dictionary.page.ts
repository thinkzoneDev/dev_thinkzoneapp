import { Component, OnInit } from "@angular/core";
import { RestApiService } from "./../rest-api.service";
import { Router } from "@angular/router";
import {
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { DictionaryService } from "./dictionary.service";
import { Media, MediaObject } from "@ionic-native/media/ngx";
import { ServerDownService } from "../services/server-down.service";

@Component({
  selector: "app-dictionary",
  templateUrl: "./dictionary.page.html",
  styleUrls: ["./dictionary.page.scss"],
})
export class DictionaryPage implements OnInit {
  // input
  search_word: string = "";
  toolbarshadow = true;
  // response
  suggested_word: any = [];
  search_result: any = [];
  audio_url: string = "";

  // show-hide
  hide_suggestion_div: boolean = true;
  hide_result_div: boolean = true;

  constructor(
    private route: Router,
    public api: RestApiService,
    public dictionaryService: DictionaryService,
    private loadingController: LoadingController,
    private media: Media,
    private serverDownMsg: ServerDownService
  ) {}

  ngOnInit() {
    this.hide_suggestion_div = true;
    this.hide_result_div = true;
  }

  async search_btn_click() {
    this.hide_suggestion_div = true;
    this.hide_result_div = true;
    if (
      this.search_word == undefined ||
      this.search_word == null ||
      this.search_word.trim() == ""
    ) {
      // do nothing
      alert("Please enter a valid word.");
    } else {
      const loading = await this.loadingController.create({ duration: 35000 });
      await loading.present();
      await this.api.getdictionarysearchresult(this.search_word).subscribe(
        (res) => {
          loading.dismiss();
          this.show_result(res);
        },
        (err) => {
          loading.dismiss();
          this.serverDownMsg.presentToast();
        }
      );
    }
  }

  show_result(data) {
    if (Object.keys(data).length > 0) {
      if (typeof data[0] == "object") {
        this.hide_suggestion_div = true;
        this.hide_result_div = false;
        this.search_result = data;

        //get audio file url
        let audiofilename =
          data[0].hwi.prs[0].sound == undefined ||
          data[0].hwi.prs[0].sound == null ||
          data[0].hwi.prs[0].sound == ""
            ? ""
            : data[0].hwi.prs[0].sound.audio;
        if (audiofilename.length > 0) {
          let subdirectory = audiofilename.substring(0, 1);
          this.audio_url =
            "https://media.merriam-webster.com/audio/prons/en/us/mp3/" +
            subdirectory +
            "/" +
            audiofilename +
            ".mp3";
        } else {
          this.audio_url = "";
        }
      } else {
        this.hide_suggestion_div = false;
        this.hide_result_div = true;
        this.suggested_word = data;
      }
    }
  }

  suggested_word_click(suggested) {
    this.search_word = suggested;
    this.search_btn_click();
  }

  play_audio() {
    const file: MediaObject = this.media.create(this.audio_url);
    file.onStatusUpdate.subscribe((status) => console.log(status)); // fires when file status changes
    file.onSuccess.subscribe(() => console.log(""));
    file.onError.subscribe((error) => console.log("Error!", error));
    file.play();
  }

  close_btn_click() {
    this.route.navigate(["/tools"]);
  }
}
