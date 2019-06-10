import { Component } from '@angular/core';

export interface PeriodicElement {
  type: string;
  time: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {type: 'Entrada', time: '10:00h'},
  {type: 'Salida', time: '16:00h'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  displayedColumns: string[] = ['type', 'time'];
  dataSource = ELEMENT_DATA;
}
