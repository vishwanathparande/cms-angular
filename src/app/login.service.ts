import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { Register } from "../app/register";
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  mainUrl = 'http://localhost:8000';
  Url = this.mainUrl + '/api/';
  token: string;
  header: any;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const headerSettings: { [name: string]: string | string[]; } = {};
    this.header = new HttpHeaders(headerSettings);
  }

  CreateUser(register: Register) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.Url + 'user/register', register, httpOptions)
  }

  Login(model: any) {
    return this.http.post<any>(this.Url + 'user/login', model, { headers: this.header });
  }
  /*
    logout() {
      const httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.cookieService.get('token') }) };
      return this.http.post<any>(this.Url + 'user/logout', null, httpOptions);
    }
  
    userInfo() {
      const httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.cookieService.get('token') }) };
      return this.http.post<any>(this.Url + 'user/getInfo', null, httpOptions);
    }
  
    getProducts() {
      const httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.cookieService.get('token') }) };
      return this.http.post<any>(this.Url + 'user/getProducts', null, httpOptions);
    }
  
  
    saveCart(model: any) {
      const httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.cookieService.get('token') }) };
      return this.http.post<any>(this.Url + 'user/saveCart', model, httpOptions);
    }
  
    getCart() {
      const httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.cookieService.get('token') }) };
      return this.http.post<any>(this.Url + 'user/getCart', null, httpOptions);
    }
  
    updateCart(model: any) {
      const httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.cookieService.get('token') }) };
      return this.http.post<any>(this.Url + 'user/updateCart', model, httpOptions);
    }
  
    placeOrder() {
      const httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.cookieService.get('token') }) };
      return this.http.post<any>(this.Url + 'user/placeOrder', null, httpOptions);
    }
  */
  apiCall(endpoint, model: null) {
    const httpOptions = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.cookieService.get('token') }) };
    return this.http.post<any>(this.Url + endpoint, model, httpOptions);
  }
}  
