import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';

const expectedH1 = 'Tour of Products';
const expectedTitle = `${expectedH1}`;
const targetProduct = { sku: 15, name: 'Magneta' };
const targetProductDashboardIndex = 3;
const nameSuffix = 'X';
const newProductName = targetProduct.name + nameSuffix;

class Product {
  constructor(public id: number, public name: string) {}

  // Factory methods

  // Product from string formatted as '<id> <name>'.
  static fromString(s: string): Product {
    return new Product(
      +s.substr(0, s.indexOf(' ')),
      s.substr(s.indexOf(' ') + 1),
    );
  }

  // Product from product list <li> element.
  static async fromLi(li: ElementFinder): Promise<Product> {
    const stringsFromA = await li.all(by.css('a')).getText();
    const strings = stringsFromA[0].split(' ');
    return { id: +strings[0], name: strings[1] };
  }

  // Product id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Product> {
    // Get product id from the first <div>
    const id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    const name = await detail.element(by.css('h2')).getText();
    return {
      id: +id.substr(id.indexOf(' ') + 1),
      name: name.substr(0, name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    const navElts = element.all(by.css('app-root nav a'));

    return {
      navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topProducts: element.all(by.css('app-root app-dashboard > div a')),

      appProductsHref: navElts.get(1),
      appProducts: element(by.css('app-root app-products')),
      allProducts: element.all(by.css('app-root app-products li')),
      selectedProductSubview: element(by.css('app-root app-products > div:last-child')),

      productDetail: element(by.css('app-root app-product-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, async () => {
      expect(await browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, async () => {
      await expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Products'];
    it(`has views ${expectedViewNames}`, async () => {
      const viewNames = await getPageElts().navElts.map(el => el!.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', async () => {
      const page = getPageElts();
      expect(await page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top products', async () => {
      const page = getPageElts();
      expect(await page.topProducts.count()).toEqual(4);
    });

    it(`selects and routes to ${targetProduct.name} details`, dashboardSelectTargetProduct);

    it(`updates product name (${newProductName}) in details view`, updateProductNameInDetailView);

    it(`cancels and shows ${targetProduct.name} in Dashboard`, async () => {
      await element(by.buttonText('go back')).click();
      await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetProductElt = getPageElts().topProducts.get(targetProductDashboardIndex);
      expect(await targetProductElt.getText()).toEqual(targetProduct.name);
    });

    it(`selects and routes to ${targetProduct.name} details`, dashboardSelectTargetProduct);

    it(`updates product name (${newProductName}) in details view`, updateProductNameInDetailView);

    it(`saves and shows ${newProductName} in Dashboard`, async () => {
      await element(by.buttonText('save')).click();
      await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetProductElt = getPageElts().topProducts.get(targetProductDashboardIndex);
      expect(await targetProductElt.getText()).toEqual(newProductName);
    });

  });

  describe('Products tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Products view', async () => {
      await getPageElts().appProductsHref.click();
      const page = getPageElts();
      expect(await page.appProducts.isPresent()).toBeTruthy();
      expect(await page.allProducts.count()).toEqual(10, 'number of products');
    });

    it('can route to product details', async () => {
      await getProductLiEltById(targetProduct.sku).click();

      const page = getPageElts();
      expect(await page.productDetail.isPresent()).toBeTruthy('shows product detail');
      const product = await Product.fromDetail(page.productDetail);
      expect(product.sku).toEqual(targetProduct.sku);
      expect(product.name).toEqual(targetProduct.name.toUpperCase());
    });

    it(`updates product name (${newProductName}) in details view`, updateProductNameInDetailView);

    it(`shows ${newProductName} in Products list`, async () => {
      await element(by.buttonText('save')).click();
      await browser.waitForAngular();
      const expectedText = `${targetProduct.id} ${newProductName}`;
      expect(await getProductAEltById(targetProduct.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newProductName} from Products list`, async () => {
      const productsBefore = await toProductArray(getPageElts().allProducts);
      const li = getProductLiEltById(targetProduct.id);
      await li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(await page.appProducts.isPresent()).toBeTruthy();
      expect(await page.allProducts.count()).toEqual(9, 'number of products');
      const productsAfter = await toProductArray(page.allProducts);
      // console.log(await Product.fromLi(page.allProducts[0]));
      const expectedProducts =  productsBefore.filter(h => h.name !== newProductName);
      expect(productsAfter).toEqual(expectedProducts);
      // expect(page.selectedProductSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetProduct.name}`, async () => {
      const addedProductName = 'Alice';
      const productsBefore = await toProductArray(getPageElts().allProducts);
      const numProducts = productsBefore.length;

      await element(by.css('input')).sendKeys(addedProductName);
      await element(by.buttonText('Add product')).click();

      const page = getPageElts();
      const productsAfter = await toProductArray(page.allProducts);
      expect(productsAfter.length).toEqual(numProducts + 1, 'number of products');

      expect(productsAfter.slice(0, numProducts)).toEqual(productsBefore, 'Old products are still there');

      const maxId = productsBefore[productsBefore.length - 1].id;
      expect(productsAfter[numProducts]).toEqual({id: maxId + 1, name: addedProductName});
    });

    it('displays correctly styled buttons', async () => {
      const buttons = await element.all(by.buttonText('x'));

      for (const button of buttons) {
        // Inherited styles from styles.css
        expect(await button.getCssValue('font-family')).toBe('Arial, Helvetica, sans-serif');
        expect(await button.getCssValue('border')).toContain('none');
        expect(await button.getCssValue('padding')).toBe('1px 10px 3px');
        expect(await button.getCssValue('border-radius')).toBe('4px');
        // Styles defined in products.component.css
        expect(await button.getCssValue('left')).toBe('210px');
        expect(await button.getCssValue('top')).toBe('5px');
      }

      const addButton = element(by.buttonText('Add product'));
      // Inherited styles from styles.css
      expect(await addButton.getCssValue('font-family')).toBe('Arial, Helvetica, sans-serif');
      expect(await addButton.getCssValue('border')).toContain('none');
      expect(await addButton.getCssValue('padding')).toBe('8px 24px');
      expect(await addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive product search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      await getPageElts().searchBox.sendKeys('Ma');
      await browser.sleep(1000);

      expect(await getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      await getPageElts().searchBox.sendKeys('g');
      await browser.sleep(1000);
      expect(await getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetProduct.name}`, async () => {
      await getPageElts().searchBox.sendKeys('n');
      await browser.sleep(1000);
      const page = getPageElts();
      expect(await page.searchResults.count()).toBe(1);
      const product = page.searchResults.get(0);
      expect(await product.getText()).toEqual(targetProduct.name);
    });

    it(`navigates to ${targetProduct.name} details view`, async () => {
      const product = getPageElts().searchResults.get(0);
      expect(await product.getText()).toEqual(targetProduct.name);
      await product.click();

      const page = getPageElts();
      expect(await page.productDetail.isPresent()).toBeTruthy('shows product detail');
      const product2 = await Product.fromDetail(page.productDetail);
      expect(product2.id).toEqual(targetProduct.id);
      expect(product2.name).toEqual(targetProduct.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetProduct() {
    const targetProductElt = getPageElts().topProducts.get(targetProductDashboardIndex);
    expect(await targetProductElt.getText()).toEqual(targetProduct.name);
    await targetProductElt.click();
    await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    const page = getPageElts();
    expect(await page.productDetail.isPresent()).toBeTruthy('shows product detail');
    const product = await Product.fromDetail(page.productDetail);
    expect(product.sku).toEqual(targetProduct.id);
    expect(product.name).toEqual(targetProduct.name.toUpperCase());
  }

  async function updateProductNameInDetailView() {
    // Assumes that the current view is the product details view.
    await addToProductName(nameSuffix);

    const page = getPageElts();
    const product = await Product.fromDetail(page.productDetail);
    expect(product.sku).toEqual(targetProduct.id);
    expect(product.name).toEqual(newProductName.toUpperCase());
  }

});

async function addToProductName(text: string): Promise<void> {
  const input = element(by.css('input'));
  await input.sendKeys(text);
}

async function expectHeading(hLevel: number, expectedText: string): Promise<void> {
  const hTag = `h${hLevel}`;
  const hText = await element(by.css(hTag)).getText();
  expect(hText).toEqual(expectedText, hTag);
}

function getProductAEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getProductLiEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toProductArray(allProducts: ElementArrayFinder): Promise<Product[]> {
  return allProducts.map(product => Product.fromLi(product!));
}
