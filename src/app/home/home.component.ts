import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class HomeComponent implements OnInit {

  public user = null;
  public start_date = null;
  public end_date = null;
  public selected_date = null;
  public records = 645;
  public editingRecord = false;

  public dataSource = [
    {date: '05/06/2019', time: '10:00h', type: 'Entrada', employee: 'Óscar Piqueras', synced: true},
    {date: '05/07/2019', time: '11:00h', type: 'Entrada', employee: 'Óscar Piqueras', synced: true},
    {date: '05/08/2019', time: '12:00h', type: 'Salida', employee: 'Óscar Piqueras', synced: false},
    {date: '05/09/2019', time: '13:00h', type: 'Entrada', employee: 'Óscar Piqueras', synced: true},
    {date: '05/10/2019', time: '14:00h', type: 'Entrada', employee: 'Óscar Piqueras', synced: true},
    {date: '15/06/2019', time: '15:00h', type: 'Entrada', employee: 'Óscar Piqueras', synced: false},
    {date: '16/06/2019', time: '16:00h', type: 'Salida', employee: 'Óscar Piqueras', synced: true},
    {date: '17/06/2019', time: '17:00h', type: 'Entrada', employee: 'Óscar Piqueras', synced: true}
  ];
  public adminDisplayedColumns: string[] = ['date', 'time', 'type', 'employee', 'synced'];
  public employeeDisplayedColumns: string[] = ['time', 'type', 'synced', 'edit', 'delete'];

  public recordForm: FormGroup = new FormGroup({
    record_time: new FormControl('', [Validators.required]),
    record_type: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private userService: UserService, private _adapter: DateAdapter<any>) {
    this._adapter.setLocale('es-ES');
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.selected_date = new Date();
    let date = new Date();
    this.end_date = new FormControl(new Date(date));
    date.setMonth(date.getMonth() - 1)
    this.start_date = new FormControl(new Date(date));
  }

  logout() {
    if (confirm('¿Realmente quiere cerrar la sesión?')) {
      this.userService.logout();
      this.router.navigate(['login']);
    }
  }

  csv() {
    alert('Descargando');
  }

  getPeriodMessage() {
    return 'Del ' + this.start_date.value.toLocaleDateString('es-ES') + ' al ' + this.end_date.value.toLocaleDateString('es-ES');
  }

  getRecordsMessage() {
    return 'Descargar los ' + this.records + ' registros seleccionados';
  }

  onSelect(event) {
    console.log(event);
    this.selected_date= event;
  }

  getSelectedDate() {
    return this.selected_date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  getWeek() {
    let onejan = new Date(this.selected_date.getFullYear(), 0, 1);
    let week = Math.ceil( (((this.selected_date.valueOf() - onejan.valueOf()) / 86400000) + onejan.getDay() + 1) / 7 );
    return 'Semana ' + week + ' de ' + this.selected_date.getFullYear();
  }

  validate() {
    alert('Validar');
  }

  sync() {
    alert('Sincronizar');
  }

  newRecord() {
    this.editingRecord = true;
  }

  cancelRecord() {
    this.editingRecord = false;
  }

}
