import {AutoCompleteService} from 'ionic4-auto-complete';
import {Injectable} from "@angular/core";
import { Observable, of, from, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class DictionaryService  implements AutoCompleteService {
  labelAttribute = "name";
  constructor(private http: HttpClient,) {}
  
  getResults(keyword:string) : Observable<any> {
    let url = baseUrl + 'getdictionarysearchresult/'+keyword;
    return this.http.get(url, httpOptions).pipe(map(this.extractData),catchError(this.handleError));
  }

  // api call error handle
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('@@@ dictionary.service | Error=', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status},`+`body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
}