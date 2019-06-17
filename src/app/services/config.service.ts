import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  private END_POINT = 'https://localhost:5001/api';

  getEndPoint() : string {
    return this.END_POINT;
  }

}
