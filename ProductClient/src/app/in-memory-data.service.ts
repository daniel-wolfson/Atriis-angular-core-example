import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const products = [
      { sku: 11, name: 'Dr Nice' },
      { sku: 12, name: 'Narco' },
      { sku: 13, name: 'Bombasto' },
      { sku: 14, name: 'Celeritas' },
      { sku: 15, name: 'Magneta' },
      { sku: 16, name: 'RubberMan' },
      { sku: 17, name: 'Dynama' },
      { sku: 18, name: 'Dr IQ' },
      { sku: 19, name: 'Magma' },
      { sku: 20, name: 'Tornado' }
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
