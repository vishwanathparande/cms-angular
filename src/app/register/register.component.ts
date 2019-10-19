import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Register } from '../register';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MustMatch } from '../confirm-equal-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  UserForm: any;
  submitted = false;
  errorMessage = new Array;
  constructor(private router: Router, private formbulider: FormBuilder, private loginService: LoginService, private cookieService: CookieService) { }

  ngOnInit() {
    if (this.cookieService.check('token')) {
      this.router.navigate(['/dashboard']);
    }
    this.UserForm = this.formbulider.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      mobile: ['', [Validators.required]],
      address: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get fval() { return this.UserForm.controls; }

  onFormSubmit() {
    this.submitted = true;
    const user = this.UserForm.value;
    if (this.UserForm.invalid) {
      return;
    }
    this.register(user);
  }
  register(register: Register) {

    this.loginService.CreateUser(register).subscribe(
      data => {
        if (data.status == "Success") {
          this.UserForm.reset();
          sessionStorage.setItem('registrationMessage', 'Thank you for registration.');
          this.router.navigate(['/login']);
        }
        else {
          for (let message in data.messages) {
            this.errorMessage[message] = data.messages[message];
          }
        }
      },
      error => {
        this.errorMessage = error.message;
      });
  }
}    
