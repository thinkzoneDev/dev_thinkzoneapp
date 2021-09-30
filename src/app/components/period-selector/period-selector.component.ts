import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";
import { ToastController, LoadingController, Events } from "@ionic/angular";
import { RestApiService } from "./../../rest-api.service";

@Component({
  selector: "app-period-selector",
  templateUrl: "./period-selector.component.html",
  styleUrls: ["./period-selector.component.scss"],
})
export class PeriodSelectorComponent implements OnInit {
  @Input() month;
  @Output() selected;

  userid: string = "";
  prefered_language: string = "";
  active_month_list;
  default_month_list;
  selected_subject: string = "";
  selected_level: string = "1";
  selected_month = "";
  selected_week = "";
  week_list;

  constructor(
    private api: RestApiService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    public events: Events
  ) {
    this.prefered_language = localStorage.getItem("_language");
    this.userid = localStorage.getItem("_userid");
    this.selected_level = "1";
    this.selected = new EventEmitter();

    events.subscribe("activity:completed", (body) => {
      // user and time are the same arguments passed in `events.publish(user, time)`

      var all_completed = true;
      for (var i = 0; i < this.week_list.length; i++) {
        if (this.week_list[i].value == body.week) {
          this.week_list[i].iscompleted = true;
        }

        if (!this.week_list[i].iscompleted) all_completed = false;
      }

      if (all_completed) {
        for (var m = 0; m < this.active_month_list.length; m++) {
          if (this.active_month_list[m].value == body.month) {
            this.active_month_list[m].iscompleted = true;
          }
        }
      }
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.month.currentValue == null) {
      return;
    }
    this.active_month_list = [];
    changes.month.currentValue.forEach((element) => {
      if (!element.disabled) {
        this.active_month_list.push({
          name: element.text,
          value: element.value,
          selected: false,
          iscompleted: element.iscompleted,
        });
        this.selected_subject = element.subject;
        this.default_month_list = this.active_month_list;
      }
    });
  }

  async refresh() {
    this.active_month_list.forEach((element) => {
      element.selected = false;
    });
    this.selected_month = "";
    this.week_list = [];
    this.selected_week = "";

    var _userid = localStorage.getItem("_userid");
    this.api
      .gettchassessmentbylevel(
        _userid,
        "en",
        "pge",
        this.selected_level,
        "-1",
        this.selected_subject
      )
      .subscribe(
        (res) => {
          for (var i = 0; i < this.active_month_list.length; i++) {
            var month_data = res.find(
              (r) => r.month == this.active_month_list[i].value
            );
            if (month_data)
              this.active_month_list[i].iscompleted = month_data.iscompleted;
            else this.active_month_list[i].iscompleted = false;
          }
        },
        (err) => {}
      );
  }

  // level on change
  level_change(lvl) {
    this.selected_level = lvl;
    this.refresh();
  }

  // month_onchange(value) {
  //   this.week_list = [];
  //   this.selected_week = '';
  //   this.active_month_list.forEach(element => {
  //     element.selected = false;
  //   });
  //   this.active_month_list[value - 1].selected = true;
  //   this.selected_month = value;
  //   this.create_week_list(this.prefered_language, this.selected_subject, this.selected_level, 'month'+this.selected_month);
  // }

  // async create_week_list(pref_lang, subject, level, month) {
  //   const loading = await this.loadingController.create({});
  //   await loading.present();
  //   //await this.api.gettchassessment(pref_lang, 'pge', level, month, subject).subscribe(res => {
  //   await this.api
  //     .gettchassessment1(this.userid, pref_lang, "pge", level, month, subject)
  //     .subscribe(
  //       (res) => {
  //         if (res.length >= 0) {
  //           let obj = {};
  //           this.week_list = [];
  //           for (let i = 0; i < res.length; i++) {
  //             obj = {
  //               value: "" + (i + 1),
  //               text: "" + res[i].question,
  //               iscompleted: res[i].activityobj.length > 0 ? true : false,
  //             };
  //             this.week_list.push(obj);
  //           }
  //           this.emit_event();
  //         }
  //         loading.dismiss();
  //       },
  //       (err) => {
  //         loading.dismiss();
  //       }
  //     );
  // }

  getClassValue(m) {
    return m.selected ? "selected-chip" : "unselected-chip";

    // if(m.iscompleted) {
    //   return  "completemonthselected-chip"
    // }
    //  else {
    //   return m.selected ? "selected-chip":"unselected-chip";
    //   //return  "completemonthselected-chip"
    //  }
  }

  week_onchange(value) {
    this.selected_week = value;
    this.emit_event();
  }
  getweekvalue(m) {
    if (m.iscompleted) {
      return "completeweekselected-chip";
    } else {
      return m.value === this.selected_week
        ? "weekselected-chip"
        : "weekunselected-chip";
    }
  }

  emit_event() {
    if (this.selected_month !== "" && this.selected_week !== "") {
      this.selected.emit(
        this.selected_month +
          "$" +
          this.selected_week +
          "$" +
          this.selected_level
      );
    }
  }
}
