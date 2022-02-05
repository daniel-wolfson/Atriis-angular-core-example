import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProductSearchComponent } from '../product-search/product-search.component';
import { ProductService } from '../product.service';
import { HEROES } from '../mock-products';

import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
    let component: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;
  let productService;
  let getProductsSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    productService = jasmine.createSpyObj('ProductService', ['getProducts']);
    getProductsSpy = productService.getProducts.and.returnValue(of(HEROES));
    TestBed
        .configureTestingModule({
            declarations: [AboutComponent, ProductSearchComponent],
          imports: [RouterTestingModule.withRoutes([])],
          providers: [{provide: ProductService, useValue: productService}]
        })
        .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top Products" as headline', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual('Top Products');
  });

  it('should call productService', waitForAsync(() => {
       expect(getProductsSpy.calls.any()).toBe(true);
     }));

  it('should display 4 links', waitForAsync(() => {
       expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
     }));
});
