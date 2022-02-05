import { Component, OnInit } from '@angular/core';

import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = false;
  productFilter: string = ""

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.loading=true;
    this.productService.getProducts(this.productFilter)
    .subscribe(products => {
      this.products = products;
      this.loading=false;
    }    );
  }
}
