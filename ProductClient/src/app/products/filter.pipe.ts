import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, searchValue: string): any {

    if (!searchValue) return value;
    
    return value.filter((v: Product) => 
      v.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
  }
}