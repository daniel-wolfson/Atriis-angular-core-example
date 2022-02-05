import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: [ './product-detail.component.css' ]
})
export class ProductDetailComponent implements OnInit, OnChanges {
  product: Product | undefined;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(): void {
    this.loading = true;
    const sku = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.productService.getProduct(sku)
      .subscribe(product => {
        this.product = product;
        this.loading = false;
      });
  }

  goBack(): void {
    this.location.back();
  }
}
