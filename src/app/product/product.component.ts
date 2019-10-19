import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { CookieService } from 'ngx-cookie-service';
import { $ } from 'protractor';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  url: string = '';
  errorMessage: string;
  productData;
  priceData = new Object();

  constructor(private router: Router, private LoginService: LoginService, private cookieService: CookieService) { }

  ngOnInit() {

    if (!this.cookieService.check('token')) {
      this.router.navigate(['/login']);
    }
    this.url = this.LoginService.mainUrl;
    this.getProducts();
  }

  getProducts() {
    this.LoginService.apiCall('user/getProducts', null).subscribe(
      res => {
        if (res.status == "Success") {
          this.productData = res.data;
          this.productData.forEach(data => {
            this.priceData[data.id] = data.price.toFixed(2);
          });
        }
        else {
          this.errorMessage = res.error;
        }
      },
      error => {
        this.errorMessage = error.message;
      });
  };

  quantityChange(event) {
    let id = event.target.id;
    id = id.split('_');
    let value = event.target.value;
    let amount = this.priceData[id[1]] * value;
    document.getElementById('total_price_' + id[1]).innerHTML = amount.toFixed(2);
    document.getElementById('cart_' + id[1]).setAttribute("quantity", value);
  }

  addToCart(event) {
    document.getElementById('backModal').style.display = 'block';
    let id = event.target.id;
    id = id.split('_');
    var productsData = new Object;
    productsData['product_id'] = id[1];
    productsData['quantity'] = event.target.attributes.quantity.nodeValue;
    this.saveCart(productsData);
  }

  saveCart(productsData) {
    this.LoginService.apiCall('user/saveCart', productsData).subscribe(
      res => {
        if (res.status == "Success") {
          if (res.message == 'true') {
            sessionStorage.setItem('quantityError', 'You can add only max 5 quantity of each product.');
          } else {
            sessionStorage.setItem('quantityError', '');
          }
          document.getElementById('backModal').style.display = 'none';
          this.router.navigate(['/cart']);
        }
        else {
          document.getElementById('backModal').style.display = 'none';
          this.errorMessage = res.error;
        }
      },
      error => {
        document.getElementById('backModal').style.display = 'none';
        this.errorMessage = error.message;
      });
  };

}
