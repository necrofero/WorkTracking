import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DataService } from '../services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class HomeComponent implements OnInit {

  public user = null;
  public start_date = null;
  public end_date = null;
  public selected_date = null;
  public records = 0;
  public editingRecord = false;
  public syncedWeek = false;
  public tx = '';

  public dataSource = [];
  public adminDisplayedColumns: string[] = ['date', 'time', 'type', 'employee', 'synced'];
  public employeeDisplayedColumns: string[] = ['time', 'type', 'synced', 'edit', 'delete'];

  public recordForm: FormGroup = new FormGroup({
    record_time: new FormControl('', [Validators.required]),
    record_type: new FormControl('entrance', [Validators.required])
  });

  constructor(private router: Router, private userService: UserService, private dataService: DataService, private _adapter: DateAdapter<any>) {
    this._adapter.setLocale('es-ES');
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.selected_date = moment();
    let date = moment()
    this.end_date = new FormControl(moment(date));
    date.month(date.month() - 1)
    this.start_date = new FormControl(moment(date));
    this.getData();
  }

  getData() {
    let start = this.start_date.value;
    let end = this.end_date.value;
    let employee = '_';
    if (!this.user.isAdmin) {
      start = end = this.selected_date;
      employee = this.user.id;
    }
    this.dataService.getRecords(start, end, employee).subscribe(records => {
      let newData = [];
      records.forEach(record => {
        newData.push(this.formatRecord(record))
      });
      this.dataSource = newData;
      this.records = this.dataSource.length;
      if (!this.user.isAdmin) {
        this.dataService.getSyncedData(this.selected_date.year(), this.selected_date.week(), employee).subscribe(result => {
          this.syncedWeek = (result.id !== '');
          this.tx = result.tx;
          if (this.syncedWeek) {
            this.employeeDisplayedColumns = ['time', 'type', 'synced'];
          }
          else {
            this.employeeDisplayedColumns = ['time', 'type', 'synced', 'edit', 'delete'];
          }
        });
      }
    });
  }

  formatRecord(record) {
    return {
      id: record.id,
      date: (new Date(record.dateTime)).toLocaleDateString('es-ES'),
      time: (new Date(record.dateTime)).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}),
      type: record.type == 'entrance' ? 'Entrada' : 'Salida',
      employee: record.employeeName,
      synced: record.synced
    }
  }

  logout() {
    if (confirm('¿Realmente quiere cerrar la sesión?')) {
      this.userService.logout();
      this.router.navigate(['login']);
    }
  }

  csv() {
    let csv = 'Fecha,Hora,Tipo,Empleado';
    this.dataSource.forEach(record => {
      let csv_line = [];
      csv_line.push(record.date);
      csv_line.push(record.time);
      csv_line.push(record.type);
      csv_line.push(record.employee);
      csv = csv + '\n' + csv_line.join(',');
    });
    var filename = 'work_tracking.csv';
    csv = 'data:text/csv;charset=utf-8,' + csv;
    var data = encodeURI(csv);
    var link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
  }

  getPeriodMessage() {
    return 'Del ' + this.start_date.value.format('D/M/YYYY') + ' al ' + this.end_date.value.format('D/M/YYYY');
  }

  getRecordsMessage() {
    return 'Descargar los ' + this.records + ' registros seleccionados';
  }

  onSelect(event) {
    if (event) {
      this.selected_date= event;
    }
    this.getData();
  }

  getSelectedDate() {
    return this.selected_date.format('D/M/YYYY');
  }

  getWeek() {
    return 'Semana ' + this.selected_date.week() + ' de ' + this.selected_date.year();
  }

  validate() {
    let start = moment(this.selected_date).startOf('week');
    let end = moment(this.selected_date).endOf('week');
    console.log(start.format());
    console.log(end.format());
    this.dataService.getRecords(start, end, this.user.id).subscribe(records => {
      let csv = 'Fecha,Hora,Tipo,Empleado';
      records.forEach(record => {
        let formattedRecord = this.formatRecord(record);
        let csv_line = [];
        csv_line.push(formattedRecord.date);
        csv_line.push(formattedRecord.time);
        csv_line.push(formattedRecord.type);
        csv_line.push(formattedRecord.employee);
        csv = csv + '\n' + csv_line.join(',');
      });
      var filename = 'work_tracking.csv';
      csv = 'data:text/csv;charset=utf-8,' + csv;
      var data = encodeURI(csv);
      var link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    });
  }

  sync() {
    if (confirm('¿Realmente quieres sincronizar los registros? Ya no podrán ser modificados.')) {
      this.dataService.setSyncedData(this.selected_date.year(), this.selected_date.week(), this.user.id).subscribe(result => {
        this.syncedWeek = true;
        this.employeeDisplayedColumns = ['time', 'type', 'synced'];
        this.tx = result.value.tx;
      });
    }
  }

  newRecord() {
    this.editingRecord = true;
  }

  cancelRecord() {
    this.editingRecord = false;
  }

  onSubmit() {
    if (!this.recordForm.invalid) {
      let dateTime = moment(this.selected_date);
      let splitTime = this.recordForm.get('record_time').value.split(':');
      dateTime.hour(splitTime[0]);
      dateTime.minutes(splitTime[1]);
      let newRecord = {
        id: '',
        employeeId: this.user.id,
        employeeName: this.user.name + ' ' + this.user.surname,
        dateTime: dateTime.format('YYYY-MM-DDTHH:mm'),
        type: this.recordForm.get('record_type').value,
        week: this.selected_date.week(),
        synced: false
      }
      this.dataService.insertRecord(newRecord).subscribe(record => {
        this.getData();
      });
    }
  }

  delete(id) {
    if (confirm("¿Realmente quieres eliminar el registro?")) {
      this.dataService.deleteRecord(id).subscribe(result => {
        this.getData();
      });
    }
  }

  viewTx() {
    window.open(`https://ropsten.etherscan.io/tx/${this.tx}`, '_blank');
  }

}
