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

  getRecords(start: Date, end: Date) : Observable<any> {
    const formatted_start = `${start.getDate()}_${start.getMonth() + 1}_${start.getFullYear()}`;
    const formatted_end = `${end.getDate()}_${end.getMonth() + 1}_${end.getFullYear()}`;
    return this.http.get<any>(`${this.configService.getEndPoint()}/record/${formatted_start}/${formatted_end}`)
      .pipe(map(record => {
        return record;
    }));
  }

}
