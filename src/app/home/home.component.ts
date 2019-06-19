import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { DataService } from '../services/data.service';

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
  public records = 0;
  public editingRecord = false;
  public syncedWeek = false;

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
    this.selected_date = new Date();
    let date = new Date();
    this.end_date = new FormControl(new Date(date));
    date.setMonth(date.getMonth() - 1)
    this.start_date = new FormControl(new Date(date));
    this.recordForm.get("record_time").setValue("10:10");
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
        // Synced week
        this.syncedWeek = true;
        if (this.syncedWeek) {
          this.employeeDisplayedColumns = ['time', 'type', 'synced'];
        }
        else {
          this.employeeDisplayedColumns = ['time', 'type', 'synced', 'edit', 'delete'];
        }
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
    return 'Del ' + this.start_date.value.toLocaleDateString('es-ES') + ' al ' + this.end_date.value.toLocaleDateString('es-ES');
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

  onSubmit() {
    if (!this.recordForm.invalid) {
      let onejan = new Date(this.selected_date.getFullYear(), 0, 1);
      let week = Math.ceil( (((this.selected_date.valueOf() - onejan.valueOf()) / 86400000) + onejan.getDay() + 1) / 7 );
      let dateTime = new Date(this.selected_date);
      let splitTime = this.recordForm.get('record_time').value.split(':');
      dateTime.setHours(splitTime[0]);
      dateTime.setMinutes(splitTime[1]);
      let newRecord = {
        id: '',
        employeeId: this.user.id,
        employeeName: this.user.name + ' ' + this.user.surname,
        dateTime: dateTime,
        type: this.recordForm.get('record_type').value,
        week: week,
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

}
