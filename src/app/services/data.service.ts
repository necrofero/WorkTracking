import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  getRecords(start: any, end: any, employee: string) : Observable<any> {
    const formatted_start = `${start.date()}_${start.month() + 1}_${start.year()}`;
    const formatted_end = `${end.date()}_${end.month() + 1}_${end.year()}`;
    return this.http.get<any>(`${this.configService.getEndPoint()}/record/${formatted_start}/${formatted_end}/${employee}`)
      .pipe(map(record => {
        return record;
    }));
  }

  insertRecord(record: any) : Observable<any> {
    console.log(record);
    return this.http.post<any>(`${this.configService.getEndPoint()}/record/`, record)
      .pipe(map(record => {
        return record;
    }));
  }

  deleteRecord(recordId: string) : Observable<any> {
    return this.http.delete<any>(`${this.configService.getEndPoint()}/record/${recordId}`);
  }

  getSyncedData(year: number, week: number, employee: string) : Observable<any> {
    return this.http.get<any>(`${this.configService.getEndPoint()}/sync/${year}/${week}/${employee}`)
      .pipe(map(result => {
        return result;
    }));
  }

  setSyncedData(year: number, week: number, employee: string) : Observable<any> {
    return this.http.post<any>(`${this.configService.getEndPoint()}/sync/${year}/${week}/${employee}`, null)
      .pipe(map(result => {
        return result;
    }));
  }

}
