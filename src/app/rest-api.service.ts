import { Injectable } from "@angular/core";
import { Observable, from, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
} from "@angular/common/http";
import { catchError, tap, map, timeout } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";

//---------------------- Packages for Offline Syncing ------------------------
import { OfflineManagerService } from "./services/offline-manager.service";
import { NetworkService, ConnectionStatus } from "./services/network.service";
import { Storage } from "@ionic/storage";
import { MONKEY_PATCH_KEY_NAME } from "@angular/core/src/render3/interfaces/context";
//----------------------------------------------------------------------------

const API_STORAGE_KEY = "specialkey";
const API_URL = environment.baseUrl;
const baseUrl = environment.baseUrl;
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class RestApiService {
  url: string;
  constructor(
    private http: HttpClient,
    private networkService: NetworkService,
    private storage: Storage,
    private offlineManager: OfflineManagerService
  ) {}

  // api call error handle
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("@@@ rest-api.service | Error=", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status},` + `body was: ${error.error}`
      );
    }
    return throwError("Something bad happened; please try again later.");
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  // ----------------------------- nrusingh 14.11.2019 for offline feature ----------------------------
  // Save result of API requests to sqLite db
  private setLocalData(key, data) {
    this.storage.ready().then(() => {
      this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
    });
  }

  // Get cached API result from sqLite db
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }

  // ------------------------------------ my coding starts from here ----------------------------------
  // get applications current version
  getappversion(app_package): Observable<any> {
    this.url = baseUrl + "getappversion/" + app_package;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getappversion"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getappversion", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // getcurrentdate
  getcurrentdate(): Observable<any> {
    this.url = baseUrl + "getcurrentdate";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getcurrentdate"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getcurrentdate", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // get all issue
  getAllModule(userid, language): Observable<any> {
    this.url =
      baseUrl + "tch_training_getmodulewisestatus/" + userid + "/" + language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_tch_training_getmodulewisestatus"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_tch_training_getmodulewisestatus", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //get all ppt training modules
  getpptAllModule(userid, language): Observable<any> {
    this.url =
      baseUrl + "ppt_trans_getmodulewisestatus/" + userid + "/" + language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_ppt_getallmaastermodulesdata"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_ppt_getallmaastermodulesdata", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get all training topics
  gettrainingcontents(moduleid, language): Observable<any> {
    this.url = baseUrl + "getcontentdetails/" + moduleid + "/" + language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getcontentdetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getcontentdetails", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //get all ppt training contents
  getppttrainingcontents(moduleid, language): Observable<any> {
    this.url = baseUrl + "ppt_getcontentdetails/" + moduleid + "/" + language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_ppt_getcontentdetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_ppt_getcontentdetails", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  getmoduledetails(userid, moduleid, language): Observable<any> {
    this.url =
      baseUrl + "getmoduledetails/" + userid + "/" + moduleid + "/" + language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getmoduledetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getmoduledetails", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //get ppt module details
  getpptmoduledetails(userid, moduleid, language): Observable<any> {
    this.url =
      baseUrl +
      "ppt_trans_getmoduledetails/" +
      userid +
      "/" +
      moduleid +
      "/" +
      language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_ppt_trans_getmoduledetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_ppt_trans_getmoduledetails", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  gettrainingcontentsdata(
    moduleid,
    submoduleid,
    topicid,
    language
  ): Observable<any> {
    this.url =
      baseUrl +
      "getalltrainingcontents/" +
      moduleid +
      "/" +
      submoduleid +
      "/" +
      topicid +
      "/" +
      language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getalltrainingcontents"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getalltrainingcontents", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //get ppt training contents data
  getppttrainingcontentsdata(
    moduleid,
    submoduleid,
    topicid,
    language
  ): Observable<any> {
    this.url =
      baseUrl +
      "ppt_getallcontents/" +
      moduleid +
      "/" +
      submoduleid +
      "/" +
      topicid +
      "/" +
      language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_ppt_getallcontents"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_ppt_getallcontents", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  gettopicdetails(userid, moduleid, submoduleid, topicid): Observable<any> {
    this.url =
      baseUrl +
      "gettopicdetails/" +
      userid +
      "/" +
      moduleid +
      "/" +
      submoduleid +
      "/" +
      topicid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettopicdetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettopicdetails", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //get ppt user training status
  getppttopicdetails(userid, moduleid, submoduleid, topicid): Observable<any> {
    this.url =
      baseUrl +
      "ppt_trans_gettopicdetails/" +
      userid +
      "/" +
      moduleid +
      "/" +
      submoduleid +
      "/" +
      topicid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_ppt_trans_gettopicdetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_ppt_trans_gettopicdetails", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // api to get files for training
  getallfiles() {
    this.url = baseUrl + "getallfiles";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallfiles"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallfiles", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // set checkin time
  setcheckintime(data): Observable<any> {
    this.url = baseUrl + "setcheckintime";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // set setcheckout time
  setcheckouttime(id, time): Observable<any> {
    this.url = baseUrl + "setcheckouttime/" + id + "/" + time;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", time));
    } else {
      return this.http.put(this.url, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", time);
          throw new Error(err);
        })
      );
    }
  }
  ppt_trans_getoverallstatus(userid, language): Observable<any> {
    this.url =
      baseUrl + "ppt_trans_getoverallstatus/" + userid + "/" + language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_ppt_trans_getoverallstatus"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_ppt_trans_getoverallstatus", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }
  // get user by userid
  getuserbyuserid(userid): Observable<any> {
    this.url = baseUrl + "getuserbyuserid/" + userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getuserbyuserid"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getuserbyuserid", res);
        }),
        // //timeout(5000),
        catchError(this.handleError)
      );
    }
  }
  //chart data by studentIduser by userid
  getGraphdetailsbyid(userid): Observable<any> {
    this.url = baseUrl + "getGraphdetailsbyid/" + userid;
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {
        //
      }),
      catchError((err, caught) => {
        return throwError(err);
      })
    );
  }

  // get assessment list of a specific student
  gettchassessmenttest_student(userid, studentid, program): Observable<any> {
    this.url =
      baseUrl +
      "gettchassessmenttest_student/" +
      userid +
      "/" +
      studentid +
      "/" +
      program;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchassessmenttest_student"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchassessmenttest_student", res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  // student list of a specific teacher
  /*getallstudentsbyteacher(_userid): Observable<any> {
    this.url = baseUrl + 'getallstudentsbyteacher/' + _userid;
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline){
      return from(this.getLocalData('_getallstudentsbyteacher'));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap(res => {
          
          this.setLocalData('_getallstudentsbyteacher', res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      )
    }*/

  getallstudentsbystudentcategory(_userid, studentcategory): Observable<any> {
    this.url =
      baseUrl +
      "getactivemaasterstudentsbyuseridbycategory/" +
      _userid +
      "/" +
      studentcategory;

    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(
        this.getLocalData("_getactivemaasterstudentsbyuseridbycategory")
      );
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getactivemaasterstudentsbyuseridbycategory", res);
        }),
        //timeout(5000),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }

    /*return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));*/
  }

  // student registration
  registernewstudent(data): Observable<any> {
    this.url = baseUrl + "savemasterstudent";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }

    /*return this.http.post(baseUrl + 'registernewstudent', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));*/
  }

  // update student registration /updatestudentbyid/:id
  updatestudent(id, data): Observable<any> {
    this.url = baseUrl + "updatemasterstudent/" + id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }

  // update studentname in assessmenttest while rename is done in student details page
  updatetchassessmenttestbystudentid(studentid, data): Observable<any> {
    this.url = baseUrl + "updatetchassessmenttestbystudentid/" + studentid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }

  // deactivate student registration /updatestudentbyid/:id
  deactivatestudentbyid(id): Observable<any> {
    this.url = baseUrl + "deactivatemasterstudent/" + id;
    // if (
    //   this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    // ) {
    //   return from(this.offlineManager.storeRequest(this.url, "PUT", {}));
    // } else {
    return this.http.put(this.url, httpOptions).pipe(
      map(this.extractData),
      //timeout(5000),
      catchError((err) => {
        // this.offlineManager.storeRequest(this.url, "PUT", {});
        throw new Error(err);
      })
    );
    // }
  }

  // delete student
  deletestudentbyid(_id): Observable<any> {
    this.url = baseUrl + "deletestudentbyid/" + _id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "DELETE", {}));
    } else {
      return this.http.delete(this.url, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "DELETE", {});
          throw new Error(err);
        })
      );
    }
  }

  // get baselinetest
  getbaselinetestquestionset(data): Observable<any> {
    this.url = baseUrl + "getbaselinetestquestionset";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getbaselinetestquestionset"));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getbaselinetestquestionset", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // setlevel
  setlevelbyid(data): Observable<any> {
    this.url = baseUrl + "setlevelbyid";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // update level
  updatelevelbyid(id, data): Observable<any> {
    this.url = baseUrl + "updatelevelbyid/" + id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }

  getallstudentswithassessmentsquarterwisebyteacher(
    userid,
    program,
    stage
  ): Observable<any> {
    this.url =
      baseUrl +
      "getallstudentswithassessmentsquarterwisebyteacher/" +
      userid +
      "/" +
      program +
      "/" +
      stage;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(
        this.getLocalData("_getallstudentswithassessmentsquarterwisebyteacher")
      );
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData(
            "_getallstudentswithassessmentsquarterwisebyteacher",
            res
          );
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  getallstudentswithassessmentsbyteacher(userid, program): Observable<any> {
    this.url =
      baseUrl +
      "getallstudentswithassessmentsbyteacher/" +
      userid +
      "/" +
      program;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallstudentswithassessmentsbyteacher"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallstudentswithassessmentsbyteacher", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get all student list by teacher id
  getallstudentsbyteacherid(userid): Observable<any> {
    this.url = baseUrl + "getallstudentsbyteacherid/" + userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallstudentsbyteacherid"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallstudentsbyteacherid", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  getallstudentsbyteacherbyregddate(userid, attendance_date): Observable<any> {
    this.url =
      baseUrl +
      "getallstudentsbyteacherbyregddate/" +
      userid +
      "/" +
      attendance_date;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallstudentsbyteacherbyregddate"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallstudentsbyteacherbyregddate", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get attendance by teacher id and date
  getattendanceofteacherbydate(userid, attendancedate): Observable<any> {
    this.url =
      baseUrl + "getattendanceofteacherbydate/" + userid + "/" + attendancedate;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getattendanceofteacherbydate"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getattendanceofteacherbydate", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // get attendance by teacher id and date
  getlast7daysattendance(userid, attendancedate): Observable<any> {
    this.url =
      baseUrl + "getlast7daysattendance/" + userid + "/" + attendancedate;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("getlast7daysattendance"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("getlast7daysattendance", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // save attendance
  saveattendance(data): Observable<any> {
    this.url = baseUrl + "saveattendance";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // view payment records
  getalltchpaymentdetailsbystudentid(studentid): Observable<any> {
    this.url = baseUrl + "getalltchpaymentdetailsbystudentid/" + studentid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getalltchpaymentdetailsbystudentid"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getalltchpaymentdetailsbystudentid", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // view chartpage records
  getallstudentsbystudentid(studentid): Observable<any> {
    this.url = baseUrl + "getallstudentsbystudentid/" + studentid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallstudentsbystudentid"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallstudentsbystudentid", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // make payment
  savetchpaymentdetails(data): Observable<any> {
    this.url = baseUrl + "savetchpaymentdetails";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // get tch assessment
  gettchassessment(
    preferedlanguage,
    program,
    level,
    stage,
    subject
  ): Observable<any> {
    this.url =
      baseUrl +
      "gettchassessment/" +
      preferedlanguage +
      "/" +
      program +
      "/" +
      level +
      "/" +
      stage +
      "/" +
      subject;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchassessment"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchassessment", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  gettchassessmentbylevel(
    userid,
    preferedlanguage,
    program,
    level,
    stage,
    subject
  ): Observable<any> {
    //this.url = 'http://localhost:1234/thinkzone/gettchassessmentbylevel/'+userid+'/'+preferedlanguage+'/'+program+'/'+level+'/'+subject;
    this.url =
      baseUrl +
      "gettchassessmentbylevel/" +
      userid +
      "/" +
      preferedlanguage +
      "/" +
      program +
      "/" +
      level +
      "/" +
      subject;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchassessmentbylevel"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchassessmentbylevel", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get tch assessment
  getpgeactivityskill(
    preferedlanguage,
    program,
    subject,
    level
  ): Observable<any> {
    this.url =
      baseUrl +
      "getpgeactivityskill/" +
      preferedlanguage +
      "/" +
      program +
      "/" +
      subject +
      "/" +
      level;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getpgeactivityskill"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getpgeactivityskill", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //get training assesment details for teacher
  gettchassessmenttraining(assesmentmonth, language): Observable<any> {
    this.url =
      baseUrl + "getalltrainingassesment/" + assesmentmonth + "/" + language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchassessmenttraining"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchassessmenttraining", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get tch assessmenttest
  gettchassessmenttest1(userid, assesmentmonth, language): Observable<any> {
    this.url =
      baseUrl +
      "gettrainingassesmentdetails/" +
      userid +
      "/" +
      assesmentmonth +
      "/" +
      language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchassessmenttest"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchassessmenttest", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  gettchassessmenttest(
    studentid,
    program,
    level,
    stage,
    subject
  ): Observable<any> {
    this.url =
      baseUrl +
      "gettchassessmenttest/" +
      studentid +
      "/" +
      program +
      "/" +
      level +
      "/" +
      stage +
      "/" +
      subject;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchassessmenttest"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchassessmenttest", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // get tch assessmenttest for all student of a specific level
  gettchassessmenttest_all(
    userid,
    program,
    level,
    stage,
    subject
  ): Observable<any> {
    this.url =
      baseUrl +
      "gettchassessmenttest_all/" +
      userid +
      "/" +
      program +
      "/" +
      level +
      "/" +
      stage +
      "/" +
      subject;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchassessmenttest_all"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchassessmenttest_all", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get tch assessmentdetails for all student
  gettchassessmentdetails_all(
    userid,
    program,
    stage,
    subject
  ): Observable<any> {
    this.url =
      baseUrl +
      "gettchassessmentdetails_all/" +
      userid +
      "/" +
      program +
      "/" +
      stage +
      "/" +
      subject;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("gettchassessmentdetails_all"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchassessmentdetails_all", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  gettchassessmenttest_allsubject(obj): Observable<any> {
    this.url = baseUrl + "gettchassessmenttest_allsubject";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchassessmenttest_allsubject"));
    } else {
      return this.http.post(this.url, obj, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchassessmenttest_allsubject", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  gettchassessmenttest_allsubject_ece(obj): Observable<any> {
    this.url = baseUrl + "gettchassessmenttest_allsubject_ece";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchassessmenttest_allsubject_ece"));
    } else {
      return this.http.post(this.url, obj, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchassessmenttest_allsubject_ece", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // save assessment test for each student
  createtchassessmenttest(data): Observable<any> {
    this.url = baseUrl + "createtchassessmenttest";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }
  //save teacher assesment information
  createteachertestassesment(data): Observable<any> {
    this.url = baseUrl + "createteachertestassesment";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }
  // get distinct activities
  getmasteractivities(
    preferedlanguage,
    program,
    subject,
    month,
    week
  ): Observable<any> {
    this.url =
      baseUrl +
      "getmasteractivities/" +
      preferedlanguage +
      "/" +
      program +
      "/" +
      subject +
      "/" +
      month +
      "/" +
      week;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getmasteractivities"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getmasteractivities", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // get activity details
  getmasteractivitiydetails(
    preferedlanguage,
    program,
    subject,
    month,
    week,
    activity
  ): Observable<any> {
    this.url =
      baseUrl +
      "getmasteractivitiydetails/" +
      preferedlanguage +
      "/" +
      program +
      "/" +
      subject +
      "/" +
      month +
      "/" +
      week +
      "/" +
      activity;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getmasteractivitiydetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getmasteractivitiydetails", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get activity details
  getmasterpgeactivitiydetails(
    preferedlanguage,
    program,
    subject,

    week,
    activity
  ): Observable<any> {
    this.url =
      baseUrl +
      "getmasterpgeactivitiydetailsnostage/" +
      preferedlanguage +
      "/" +
      program +
      "/" +
      subject +
      "/" +
      week +
      "/" +
      activity;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getmasterpgeactivitiydetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getmasterpgeactivitiydetails", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get teacher activity details
  gettchactivitiydetails(
    userid,
    program,
    subject,
    month,
    week,
    activity
  ): Observable<any> {
    this.url =
      baseUrl +
      "gettchactivitiydetails/" +
      userid +
      "/" +
      program +
      "/" +
      subject +
      "/" +
      month +
      "/" +
      week +
      "/" +
      activity;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchactivitiydetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchactivitiydetails", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  gettchactivitiydetails1(data): Observable<any> {
    this.url = baseUrl + "gettchactivitiydetails1";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchactivitiydetails1"));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchactivitiydetails1", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // get tch activity by userid
  gettchactivitybyuser(userid, program, subject, month, week): Observable<any> {
    this.url =
      baseUrl +
      "gettchactivitybyuser/" +
      userid +
      "/" +
      program +
      "/" +
      subject +
      "/" +
      month +
      "/" +
      week;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchactivitybyuser"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchactivitybyuser", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //save tch feedbacck
  savetchfeedback(body): Observable<any> {
    this.url =
      baseUrl +
      "tchsavefeedback?userid=" +
      body.userid +
      "&is_like=" +
      body.is_like +
      "&feedback=" +
      body.feedback +
      "&activity_name=" +
      body.activity_name;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", body));
    } else {
      return this.http.post(this.url, body, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          // this.offlineManager.storeRequest(this.url, 'POST', body);
          throw new Error(err);
        })
      );
    }
  }

  // get tch_feedback
  gettchfeedback(body): Observable<any> {
    this.url = baseUrl + "gettchfeedback";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchfeedback"));
    } else {
      return this.http.post(this.url, body, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchfeedback", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }
  // save tch activity
  savetchactivity(data): Observable<any> {
    this.url = baseUrl + "savetchactivity";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // get tch_activity_new details
  tchactivitynew_getactivitiydetails(
    preferedlanguage,
    userid,
    program,
    subject,
    month,
    week,
    level
  ): Observable<any> {
    this.url =
      baseUrl +
      "tchactivitynew_getactivitiydetails/" +
      preferedlanguage +
      "/" +
      userid +
      "/" +
      program +
      "/" +
      subject +
      "/" +
      month +
      "/" +
      week +
      "/" +
      level;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_tchactivitynew_getactivitiydetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_tchactivitynew_getactivitiydetails", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // save tch activity new
  tchactivitynew_saveactivity(data): Observable<any> {
    this.url = baseUrl + "tchactivitynew_saveactivity";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // get dictionary word
  getdictionarysearchresult(searchword): Observable<any> {
    this.url = baseUrl + "getdictionarysearchresult/" + searchword;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getdictionarysearchresult"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getdictionarysearchresult", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // get fcm token all
  getallfcmtokenids(): Observable<any> {
    this.url = baseUrl + "getallfcmtokenids";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallfcmtokenids"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallfcmtokenids", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get fcm token by userid
  getfcmtokenidbyuserid(userid): Observable<any> {
    this.url = baseUrl + "getfcmtokenidbyuserid/" + userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getfcmtokenidbyuserid"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getfcmtokenidbyuserid", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // save fcm token
  createnewfcmtokenid(data): Observable<any> {
    this.url = baseUrl + "createnewfcmtokenid";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // update fcm token
  updatefcmtokenid(id, data): Observable<any> {
    this.url = baseUrl + "updatefcmtokenid/" + id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }

  // Teacher training
  // get all modules
  getalltrainingmodules(): Observable<any> {
    this.url = baseUrl + "getalltrainingmodules";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getalltrainingmodules"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getalltrainingmodules", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get all submodules of a module
  getalltrainingsubmodules(moduleid): Observable<any> {
    this.url = baseUrl + "getalltrainingsubmodules/" + moduleid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getalltrainingsubmodules"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getalltrainingsubmodules", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get all training contents
  getalltrainingcontents(moduleid, submoduleid): Observable<any> {
    this.url =
      baseUrl + "getalltrainingcontents/" + moduleid + "/" + submoduleid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getalltrainingcontents"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getalltrainingcontents", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get teacher training details
  gettchtrainingdetails(
    userid,
    moduleid,
    submoduleid,
    topicid
  ): Observable<any> {
    this.url =
      baseUrl +
      "gettchtrainingdetails/" +
      userid +
      "/" +
      moduleid +
      "/" +
      submoduleid +
      "/" +
      topicid;

    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettchtrainingdetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettchtrainingdetails", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  getsubmodulecompletionstatus(userid, submodule_list): Observable<any> {
    this.url =
      baseUrl +
      "getsubmodulecompletionstatus/" +
      userid +
      "/" +
      JSON.stringify(submodule_list);
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getsubmodulecompletionstatus"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getsubmodulecompletionstatus", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  getallfilelistbyapptype(apptype): Observable<any> {
    this.url = baseUrl + "getallfilelistbyapptype/" + apptype;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallfilelistbyapptype"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallfilelistbyapptype", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  getallfilelistinsidedirectorybyapptype(
    apptype,
    directoryname
  ): Observable<any> {
    this.url =
      baseUrl +
      "getallfilelistinsidedirectorybyapptype/" +
      apptype +
      "/" +
      directoryname;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallfilelistinsidedirectorybyapptype"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallfilelistinsidedirectorybyapptype", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  getdistinctdirectorylistbyapptype(apptype): Observable<any> {
    this.url = baseUrl + "getdistinctdirectorylistbyapptype/" + apptype;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getdistinctdirectorylistbyapptype"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getdistinctdirectorylistbyapptype", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  getAllFromManagersBox(): Observable<any> {
    this.url = baseUrl + "getAllFromManagersBox";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getAllFromManagersBox"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getAllFromManagersBox", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // save teacher training session
  savetchtraining(data): Observable<any> {
    this.url = baseUrl + "savetchtraining";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }
  //save training data for ppt
  saveppttchtraining(data): Observable<any> {
    this.url = baseUrl + "ppt_trans_saverecord";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }
  //update ppt training data
  updateppttchtraining(id, moduleid, topicid, data): Observable<any> {
    this.url =
      baseUrl + "ppt_trans_updaterecord/" + id + "/" + moduleid + "/" + topicid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }
  //update training
  updatetchtraining(id, moduleid, topicid, data): Observable<any> {
    this.url =
      baseUrl + "updatetchtraining/" + id + "/" + moduleid + "/" + topicid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }
  //update teacher assesment
  updateteachertrainingassesment(id, data): Observable<any> {
    this.url = baseUrl + "updateteachertrainingassesment/" + id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }
  // TZ Workshop
  // Workshop details
  getworkshopDetails(wtype, action, language, subject): Observable<any> {
    this.url =
      baseUrl +
      "getworkshopdetails/" +
      wtype +
      "/" +
      action +
      "/" +
      language +
      "/" +
      subject;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getworkshopdetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getworkshopdetails", res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  // TZ Workshop
  // Get workshop contents
  getwscontent(language, wtype, subject, action, level, day): Observable<any> {
    this.url =
      baseUrl +
      "getwscontent/" +
      language +
      "/" +
      wtype +
      "/" +
      subject +
      "/" +
      action +
      "/" +
      level +
      "/" +
      day;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getwscontent"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getwscontent", res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  // Create workshop content
  createwscontent(data): Observable<any> {
    this.url = baseUrl + "createwscontent";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // Create workshop content
  createwslevel(data): Observable<any> {
    this.url = baseUrl + "createwslevel";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // TZ Workshop Registration
  // get tz workshop registration
  getworkshopregistrationdetails(userid, wtype): Observable<any> {
    this.url =
      baseUrl + "getworkshopregistrationdetails/" + userid + "/" + wtype;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getworkshopregistrationdetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getworkshopregistrationdetails", res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  // create tz workshop registration
  createworkshopregistration(data): Observable<any> {
    this.url = baseUrl + "createworkshopregistration";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  //TZ WORKSHOP LEVEL
  // Get workshop level
  getwslevel(language, wtype, subject, day): Observable<any> {
    this.url =
      baseUrl +
      "getwslevel/" +
      language +
      "/" +
      wtype +
      "/" +
      subject +
      "/" +
      day;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getwslevel"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getwslevel", res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  // LEAP master details
  getallLeapmaster(): Observable<any> {
    this.url = baseUrl + "getallleapmaster";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallleapmaster"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallleapmaster", res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  getleapmasterDetails(teacherid): Observable<any> {
    this.url = baseUrl + "getleapmasterdetails/" + teacherid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getleapmasterdetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getleapmasterdetails", res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  // create leap master
  createleapmaster(data): Observable<any> {
    this.url = baseUrl + "createleapmaster";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // update leap master
  updateleapmaster(id, data): Observable<any> {
    this.url = baseUrl + "updateleapmaster/" + id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }

  // create leap level info
  createleaplevelinfo(data): Observable<any> {
    this.url = baseUrl + "createleaplevelinfo";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  getleaplevelinfo(objectid): Observable<any> {
    this.url = baseUrl + "getleaplevelinfo/" + objectid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getleaplevelinfo"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getleaplevelinfo", res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  // Workshop details
  getworkshopindividualdetails(
    wtype,
    language,
    subject,
    level
  ): Observable<any> {
    this.url =
      baseUrl +
      "getworkshopindividualdetails/" +
      wtype +
      "/" +
      language +
      "/" +
      subject +
      "/" +
      level;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getworkshopindividualdetails"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getworkshopindividualdetails", res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  // Skillchart file download

  // S3 BUCKET

  getfroms3(): Observable<any> {
    return this.http.get(baseUrl + "s3api/all");
  }

  // DATABASE
  geteceskillchartfileuploaddetails() {
    return this.http.get(baseUrl + "geteceskillchartfileuploaddetails", {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
      //responseType: 'text'
    });
  }

  getpgemathskillchartfileuploaddetails() {
    return this.http.get(baseUrl + "getpgemathskillchartfileuploaddetails", {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
      //responseType: 'text'
    });
  }

  getpgeengskillchartfileuploaddetails() {
    return this.http.get(baseUrl + "getpgeengskillchartfileuploaddetails", {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
      //responseType: 'text'
    });
  }

  getpgeodiaskillchartfileuploaddetails() {
    return this.http.get(baseUrl + "getpgeodiaskillchartfileuploaddetails", {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
      //responseType: 'text'
    });
  }

  // Register- check passcode
  checkpasscode(passcode): Observable<any> {
    this.url = baseUrl + "checkpasscodeexistance/" + passcode;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_checkpasscodeexistance"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_checkpasscodeexistance", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }
  //Register- check user mail id

  checkemailavailability(mailid): Observable<any> {
    this.url = baseUrl + "checkemailavailability/" + mailid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("checkemailavailability"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("checkemailavailability", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //// Register- getallschools
  getallschools(): Observable<any> {
    this.url = baseUrl + "/getalludisecodes";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getalludisecodes"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getalludisecodes", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //// Register- getallanganwadis
  getallanganwadis(): Observable<any> {
    this.url = baseUrl + "/getallanganwadilist";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallanganwadilist"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallanganwadilist", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // Register- check passcode
  checkmobilenoavailability(mobileno): Observable<any> {
    this.url = baseUrl + "checkmobilenoavailability/" + mobileno;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_checkmobilenoavailability"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_checkmobilenoavailability", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // save user
  saveuser(data): Observable<any> {
    this.url = baseUrl + "createnewuser";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // authenticate user
  authenticateuser(data): Observable<any> {
    this.url = baseUrl + "authenticateuser";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  // update user
  updateuser(id, data): Observable<any> {
    this.url = baseUrl + "updateuser/" + id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }

  // getallcentersallocatedbyuserid
  getallcentersallocatedbyuserid(_userid): Observable<any> {
    this.url = baseUrl + "getallcentersallocatedbyuserid/" + _userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallcentersallocatedbyuserid"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallcentersallocatedbyuserid", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // getcenter feedback
  getallcenterfeedback(): Observable<any> {
    this.url = baseUrl + "getallcenterfeedback";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallcenterfeedbackd"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallcenterfeedbackd", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // get messages by userid
  getmessagesbyuserid(userid): Observable<any> {
    this.url = baseUrl + "getmessagesbyuserid/" + userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getmessagesbyuserid"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getmessagesbyuserid", res);
        }),
        catchError(this.handleError)
      );
    }
  }
  //delete read messages by id

  deletemessage(deleteid): Observable<any> {
    this.url = baseUrl + "deletemessagebyid/" + deleteid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("deletemessagebyid"));
    } else {
      return this.http.delete(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_deletemessagebyid", res);
        }),
        catchError(this.handleError)
      );
    }
  }
  //get unread message
  getunreadmessage(userid): Observable<any> {
    this.url = baseUrl + "getunreadmessage/" + userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getunreadmessage"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getunreadmessage", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  //save individual teacher's baseline test details
  saveteacherbaselinedata(data): Observable<any> {
    this.url = baseUrl + "saveteacherbaselinedata";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }
  //get individual teacher's baseline Information
  getbaselinedetails(type, language, userid): Observable<any> {
    this.url =
      baseUrl +
      "getteacherbaselinedata/" +
      type +
      "/" +
      language +
      "/" +
      userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getteacherbaselinedata"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getteacherbaselinedata", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }
  //get all teacher baseline questions
  // getallbaselinequestion(type, language): Observable<any> {
  //   this.url = baseUrl + "getteacherappallassessment/" + type + "/" + language;
  //   if (
  //     this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
  //   ) {
  //     return from(this.getLocalData("_getteacherappallassessment"));
  //   } else {
  //     return this.http.get(this.url, httpOptions).pipe(
  //       map(this.extractData),
  //       tap((res) => {
  //         this.setLocalData("_getteacherappallassessment", res);
  //       }),
  //       catchError(this.handleError)
  //     );
  //   }
  // }
  getallbaselinequestion(type, language): Observable<any> {
    this.url = baseUrl + "getteacherappallassessment/" + type + "/" + language;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getteacherappallassessment"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getteacherappallassessment", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }
  //Get all
  getbaselinemarksbyuser(type, userid): Observable<any> {
    this.url = baseUrl + "getbaselinemarks/" + type + "/" + userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getbaselinemarks"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getbaselinemarks", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //get teacher registration date
  getuserregdate(userid): Observable<any> {
    this.url = baseUrl + "getuserregdate/" + userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getuserregdate"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getuserregdate", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }
  // update message status by id
  updatemessagebyid(id, data): Observable<any> {
    this.url = baseUrl + "updatemessagebyid/" + id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }

  // user feedback or issues
  createnewuserfeedback(data): Observable<any> {
    this.url = baseUrl + "createnewuserfeedback";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  gethblassessmentdata(subject, language, level): Observable<any> {
    this.url =
      baseUrl +
      "gethomebasedmasterdata/" +
      subject +
      "/" +
      language +
      "/" +
      level;

    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("gethomebasedmasterdata"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("gethomebasedmasterdata", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  gethblassessment(studentid, clas, month, subject): Observable<any> {
    this.url =
      baseUrl +
      "gethblassesment/" +
      studentid +
      "/" +
      clas +
      "/" +
      month +
      "/" +
      subject;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gethblassessment"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gethblassessment", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  gethblassessmentquestion(subject, language, clas, month): Observable<any> {
    this.url =
      baseUrl +
      "gethblassesmentquestion/" +
      subject +
      "/" +
      language +
      "/" +
      clas +
      "/" +
      month;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gethblassessmentquestion"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gethblassessmentquestion", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  savehblassessmenttest(data): Observable<any> {
    this.url = baseUrl + "savehblassessmenttest";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  importexistingstudentsintohbl(userid): Observable<any> {
    this.url = baseUrl + "importexistingstudentsintohbl/" + userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_importexistingstudentsintohbl"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_importexistingstudentsintohbl", res);
        }),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  getallstudents(userid): Observable<any> {
    this.url = baseUrl + "getactivemaasterstudentsbyuserid/" + userid;

    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gethblstudentsbyteacherid"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gethblstudentsbyteacherid", res);
        }),
        //timeout(5000),
        catchError((err, caught) => {
          return throwError(err);
        })
      );
    }
  }

  getallhblstudentsbypage(page): Observable<any> {
    this.url = baseUrl + "getallhblstudentsbypage/" + page;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("getallhblstudentsbypage"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("getallhblstudentsbypage", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  createnewhblstudent(data): Observable<any> {
    this.url = baseUrl + "savemasterstudent";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  updatehblstudent(id, body): Observable<any> {
    this.url = baseUrl + "updatemasterstudent/" + id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", body));
    } else {
      return this.http.put(this.url, body, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", body);
          throw new Error(err);
        })
      );
    }
  }

  deletehblstudent(id): Observable<any> {
    this.url = baseUrl + "deactivatemasterstudent/" + id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", {}));
    } else {
      return this.http.put(this.url, httpOptions).pipe(
        map(this.extractData),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", {});
          throw new Error(err);
        })
      );
    }
  }

  getallhblschools(): Observable<any> {
    this.url = baseUrl + "getallhblschools/";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("getallhblschools"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("getallhblschools", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  //get all hbl activity documents
  getactivitydocument(apptype): Observable<any> {
    this.url = baseUrl + "getactivitydocument/" + apptype;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getactivitydocument"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getactivitydocument", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //get post call questions
  getallpostcallquestions(preferredlanguage, program): Observable<any> {
    this.url =
      baseUrl +
      "getmasterpostcallactivities/" +
      preferredlanguage +
      "/" +
      program;

    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getmasterpostcallactivities"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getmasterpostcallactivities", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //getpostcallactivitiesbyuserid
  getpostcallactivitiesbyuserid(
    userid,
    preferredlanguage,
    month,
    year
  ): Observable<any> {
    this.url =
      baseUrl +
      "gettranspostcallactivitiesbyuserid/" +
      userid +
      "/" +
      preferredlanguage +
      "/" +
      month +
      "/" +
      year;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gettranspostcallactivitiesbyuserid"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gettranspostcallactivitiesbyuserid", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //savepostcallactivities
  savepostcallactivities(data): Observable<any> {
    this.url = baseUrl + "savetranspostcallactivity";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  //get all slider images
  getalldashboardslides(): Observable<any> {
    this.url = baseUrl + "getalldashboardslides/";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getalldashboardslides"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getalldashboardslides", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  //save time spent
  savetimespentdata(data): Observable<any> {
    this.url = baseUrl + "savetimespentdata";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "POST", data));
    } else {
      return this.http.post(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "POST", data);
          throw new Error(err);
        })
      );
    }
  }

  //get all time spent data
  getalltimespentdata(userid): Observable<any> {
    this.url = baseUrl + "getalltimespentdatabyuserid/" + userid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getalltimespentdatabyuserid"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getalltimespentdatabyuserid", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  //get time spent data by month
  getalltimespentdatabymonth(userid, year): Observable<any> {
    this.url =
      baseUrl + "getalltimespentdatabyuseridbymonth/" + userid + "/" + year;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getalltimespentdatabyuseridbymonth"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getalltimespentdatabyuseridbymonth", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  // savedailyinfo
  savedailyinfo(data): Observable<any> {
    return this.http
      .post(baseUrl + "savedailyinfo", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // savecenterimage
  savecenterimage(data): Observable<any> {
    return this.http
      .post(baseUrl + "savecenterimage", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // savegeolocation
  savegeolocation(data): Observable<any> {
    return this.http
      .post(baseUrl + "savegeolocation", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save manager center feedback
  createcenterfeedbackmgr(data): Observable<any> {
    return this.http
      .post(baseUrl + "createcenterfeedbackmgr", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get all paymentinfo
  getallpaymentinfo(): Observable<any> {
    this.url = baseUrl + "getallpaymentinfo";
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save manager paymentinfo
  createpaymentinfomgr(data): Observable<any> {
    return this.http
      .post(baseUrl + "createpaymentinfomgr", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get all assessment
  getallassessment(): Observable<any> {
    this.url = baseUrl + "getallassessment";
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save manager assessment
  createassessmentmgr(data): Observable<any> {
    return this.http
      .post(baseUrl + "createassessmentmgr", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get all community
  getallcommunityvisit(): Observable<any> {
    this.url = baseUrl + "getallcommunityvisit";
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save manager community
  createcommunitymgr(data): Observable<any> {
    return this.http
      .post(baseUrl + "createcommunitymgr", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get all issue
  getallissues(): Observable<any> {
    this.url = baseUrl + "getallissues";
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save manager issue
  createissuesmgr(data): Observable<any> {
    return this.http
      .post(baseUrl + "createissuesmgr", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save daily expenses
  savedailyexpense(data): Observable<any> {
    return this.http
      .post(baseUrl + "savedailyexpense", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }
  //update profile
  updateprofile(id, data): Observable<any> {
    this.url = baseUrl + "updateuser/" + id;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.offlineManager.storeRequest(this.url, "PUT", data));
    } else {
      return this.http.put(this.url, data, httpOptions).pipe(
        map(this.extractData),
        //timeout(5000),
        catchError((err) => {
          this.offlineManager.storeRequest(this.url, "PUT", data);
          throw new Error(err);
        })
      );
    }
  }

  //App student progress
  getstudentprogressdata(userid, studentid, program): Observable<any> {
    this.url =
      baseUrl +
      "getstudentprogress/" +
      userid +
      "/" +
      studentid +
      "/" +
      program;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getstudentprogress"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getstudentprogress", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //HBL student progress
  getHblStudentProgressData(userid, studentid): Observable<any> {
    this.url = baseUrl + "gethblstudentprogress/" + userid + "/" + studentid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_gethblstudentprogress"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_gethblstudentprogress", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  //LeaderBoard Api
  getLeaderBoardData(
    userid,
    language,
    current_month,
    current_year
  ): Observable<any> {
    this.url =
      baseUrl +
      "getleaderboardrank/" +
      userid +
      "/" +
      language +
      "/" +
      current_month +
      "/" +
      current_year;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getleaderboardrank"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getleaderboardrank", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  ///User Progress Api
  getUserProgressData(userid, language, year): Observable<any> {
    this.url =
      baseUrl + "getuserprogress/" + userid + "/" + language + "/" + year;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getuserprogress"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getuserprogress", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //Get all District and States
  getAllStateData(stateid): Observable<any> {
    this.url = baseUrl + "getdistrictsofstate/" + stateid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getdistrictsofstate"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getdistrictsofstate", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //Get all District and Blocks
  getBlockData(stateid, districtid): Observable<any> {
    this.url = baseUrl + "getblocksofdistricts/" + stateid + "/" + districtid;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getblocksofdistricts"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getblocksofdistricts", res);
        }),
        //timeout(5000),
        catchError(this.handleError)
      );
    }
  }

  //-------------------------------------------------------------------------
  show(url: string) {}
}
