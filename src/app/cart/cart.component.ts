import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  url: string = '';
  productData;
  errorMessage: string;
  subTotal = 0.00;
  totalItem = 0;
  quantityError = sessionStorage.getItem('quantityError');

  constructor(private router: Router, private LoginService: LoginService, private cookieService: CookieService) { }

  ngOnInit() {
    if (!this.cookieService.check('token')) {
      this.router.navigate(['/login']);
    }
    sessionStorage.setItem('quantityError', '')
    this.url = this.LoginService.mainUrl;
    this.getCart();
  }

  getCart() {
    this.LoginService.apiCall('user/getCart', null).subscribe(
      res => {
        if (res.status == "Success") {
          this.productData = res.data;
          this.subTotal = 0.00;
          this.totalItem = 0;
          this.productData.forEach(data => {
            this.subTotal = this.subTotal + (data.price * data.quantity);
            this.totalItem = this.totalItem + data.quantity;
          });
          document.getElementById('backModal').style.display = 'none';
        }
        else {
          this.errorMessage = res.error;
        }
      },
      error => {
        this.errorMessage = error.message;
      });
  };

  cartChange(event) {
    document.getElementById('backModal').style.display = 'block';
    let id = event.target.id;
    id = id.split('_');
    var productsData = new Object;
    productsData['cart_id'] = id[1];
    productsData['quantity'] = id[0] == 'quantity' ? event.target.value : '';
    productsData['delete'] = id[0] == 'product' ? 'true' : 'false';
    this.updateCart(productsData);
  }

  updateCart(productsData) {
    this.LoginService.apiCall('user/updateCart', productsData).subscribe(
      res => {
        if (res.status == "Success") {
          this.getCart();
        }
        else {
          this.errorMessage = res.error;
        }
      },
      error => {
        this.errorMessage = error.message;
      });
  };

  orderNow() {
    document.getElementById('backModal').style.display = 'block';
    this.LoginService.apiCall('user/placeOrder', null).subscribe(
      res => {
        if (res.status == "Success") {
          sessionStorage.setItem('orderMessage', 'Thank you for your order. Your order will be send to your registered address within 3 working days.')
          this.router.navigate(['/dashboard']);
        }
        else {
          this.errorMessage = res.error;
        }
      },
      error => {
        this.errorMessage = error.message;
      });
  }

}
