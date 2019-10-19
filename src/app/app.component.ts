import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { LoginService } from './login.service';

import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cms';
  navbarOpen = false;
  errorMessage: string;
  isLogin = this.cookieService.check('token') ? true : false;
  userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  constructor(private router: Router, private LoginService: LoginService, private cookieService: CookieService) { }

  logout() {
    this.LoginService.apiCall('user/logout', null).subscribe(
      res => {
        if (res.status == "Success") {
          this.cookieService.delete('token')
          sessionStorage.removeItem('userInfo')
          sessionStorage.setItem('logoutMessage', res.message);
          window.location.href = '/login';
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
