import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public httpClient: HttpClient) { }
  sendEmail(body) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    let url = 'https://control.msg91.com/api/v5/email/send';
    return this.httpClient.post(url, body, { 'headers': headers }).
      pipe(
        map((data: any) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong!');
        })
      )
  }
  sendSMS(body) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    let url = 'https://api.msg91.com/api/v5/flow/';
    return this.httpClient.post(url, body, { 'headers': headers }).
      pipe(
        map((data: any) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong!');
        })
      )
  }
  getDistanceInfo(source,destination) {
    let url = 'https://api.distancematrix.ai/maps/api/distancematrix/json?origins='+source+'&destinations='+destination+'&key=GMslbemePYvi5RKZ639WZWFnY2Jn5';
    return this.httpClient.get(url).
      pipe(
        map((data: any) => {
          return data;
        }), catchError(error => {
          return throwError('Something went wrong!');
        })
      )
  }

}
