import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup = new FormGroup({
    user_name: new FormControl('', [Validators.required]),
    user_password: new FormControl('', [Validators.required])
  });

  public loginError = false;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
  }

  getUserNameErrorMessage() {
    let error_msg = '';
    if (this.loginForm.get('user_name').hasError('required')) {
      error_msg = 'El nombre de usuario es obligatorio';
    }
    return error_msg;
  }

  getUserPasswordErrorMessage() {
    let error_msg = '';
    if (this.loginForm.get('user_password').hasError('required')) {
      error_msg = 'La contraseña es obligatoria';
    }
    return error_msg;
  }

  getLoginErrorMessage() {
    return 'Nombre de usuario o contraseña incorrectos';
  }

  onSubmit() {
    if (!this.loginForm.invalid) {
      this.userService.login(this.loginForm.get('user_name').value, this.loginForm.get('user_password').value).subscribe(validUser => {
        if (validUser) {
          this.router.navigate(['']);
        }
        else {
          this.loginError = true;
        }
      });
    }
  }

}
