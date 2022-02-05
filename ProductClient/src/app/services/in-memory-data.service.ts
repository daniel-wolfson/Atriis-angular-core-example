import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const products = [
        { sku: 11, name: 'DrNice', price: 10.0, image: 'img' },
        { sku: 12, name: 'Narco', price: 10.0, image: 'img' },
        { sku: 13, name: 'Bombasto', price: 10.0, image: 'img' },
        { sku: 14, name: 'Celeritas', price: 10.0, image: 'img' },
        { sku: 15, name: 'Magneta', price: 10.0, image: 'img' },
        { sku: 16, name: 'RubberMan', price: 10.0, image: 'img' },
        { sku: 17, name: 'Dynama', price: 10.0, image: 'img' },
        { sku: 18, name: 'Dr IQ', price: 10.0, image: 'img' },
        { sku: 19, name: 'Magma', price: 10.0, image: 'img' },
        { sku: 20, name: 'Tornado', price: 10.0, image: 'img' }
    ];
    return {products};
  }

  // Overrides the genId method to ensure that a product always has an id.
  // If the products array is empty,
  // the method below returns the initial number (11).
  // if the products array is not empty, the method below returns the highest
  // product id + 1.
  genId(products: Product[]): number {
    return products.length > 0 ? Math.max(...products.map(product => product.sku)) + 1 : 11;
  }
}
