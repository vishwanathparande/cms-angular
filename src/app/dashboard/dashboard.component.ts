import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  model: any = {};
  errorMessage: string;
  userInfo: any = {};
  orderMessage = sessionStorage.getItem('orderMessage');
  constructor(private router: Router, private LoginService: LoginService, private cookieService: CookieService) { }

  ngOnInit() {
    document.getElementById('backModal').style.display = 'none';
    sessionStorage.setItem('orderMessage', '');
    if (!this.cookieService.check('token')) {
      this.router.navigate(['/login']);
    }
  }

}
