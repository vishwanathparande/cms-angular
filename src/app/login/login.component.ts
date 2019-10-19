import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { FormsModule, FormBuilder, Validators, } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  model: any = {};

  errorMessage: string;
  errorMessages = new Array;
  registrationMessage = sessionStorage.getItem('registrationMessage');
  loginMessage = sessionStorage.getItem('logoutMessage');
  private cookieValue: string;
  LoginForm: any;
  submitted = false;
  constructor(private router: Router, private formbulider: FormBuilder, private LoginService: LoginService, private cookieService: CookieService) { }


  ngOnInit() {
    sessionStorage.removeItem('logoutMessage');
    sessionStorage.removeItem('registrationMessage');

    if (this.cookieService.check('token')) {
      this.userInfo();
      this.router.navigate(['/dashboard']);
    }
    //sessionStorage.clear();
    this.LoginForm = this.formbulider.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get fval() { return this.LoginForm.controls; }

  login() {
    this.loginMessage = '';
    this.registrationMessage = '';

    this.submitted = true;
    this.model = this.LoginForm.value;
    if (this.LoginForm.invalid) {
      return;
    }

    this.LoginService.Login(this.model).subscribe(
      data => {
        if (data.status == "Success") {
          this.cookieService.set('token', data.token);
          this.userInfo();
        }
        else if (data.status == "Error") {
          for (let message in data.messages) {
            this.errorMessages[message] = data.messages[message];
          }
        } else {
          this.errorMessage = data.error;
        }
      },
      error => {
        this.errorMessage = error.message;
      });
  };

  userInfo() {
    this.LoginService.apiCall('user/getInfo', null).subscribe(
      res => {
        if (res.status == "Success") {
          sessionStorage.setItem('userInfo', JSON.stringify(res.data));
          window.location.href = '/dashboard';
        }
        else {
          this.errorMessage = res.error;
        }
      },
      error => {
        this.errorMessage = error.message;
      });
  };
}     
