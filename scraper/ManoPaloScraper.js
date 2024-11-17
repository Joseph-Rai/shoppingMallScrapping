const { By, until } = require('selenium-webdriver');
const IScraper = require('./IScraper');
const Product = require('../product/Product');

class ManoPaloScraper extends IScraper {
  constructor(id, password) {
    super(id, password);
    this.loginPageUrl = 'http://b2bsarlim.com/member/login.php';
  }

  // 로그인 메서드
  async login() {
    // 웹페이지 열기
    await this.driver.get(this.loginPageUrl);

    // 요소 찾기 및 상호작용
    const txtId = await this.driver.findElement(By.css('#loginId'));
    const txtPassword = await this.driver.findElement(By.css('#loginPwd'));
    const btnLogin = await this.driver.findElement(
      By.className('member_login_order_btn')
    );

    // 로그인 시도
    await txtId.sendKeys(this.id);
    await txtPassword.sendKeys(this.password);
    await btnLogin.click();

    // 로그인 완료될 때까지 대기
    await super.sleep(3000);
  }

  // 상품 URL 리스트 가져오기 메서드
  async parseProductUrlList() {
    // 상품리스트 페이지로 이동
    const allMenu = await this.driver.findElement(By.css('.depth0.gnb_menu0'));
    await allMenu.click();
    await this.driver.wait(
      until.elementLocated(By.css('.item_linenum4')),
      10000
    );

    // 상품목록 및 url 리스트 추출
    const items = await this.driver.findElements(By.css('.item_linenum4'));
    for (const item of items) {
      const url = await item.findElement(By.css('a')).getAttribute('href');
      this.productUrls.push(url);

      const thumbNailUrl = await item
        .findElement(By.css('a img'))
        .getAttribute('src');

      this.thumbNailUrls.push(thumbNailUrl);
    }
  }

  // 상품 파싱 메서드
  async parseProduct(urlIndex) {
    const url = this.productUrls[urlIndex];
    const thumbNailUrl = this.thumbNailUrls[urlIndex];
    await this.driver.get(url);
    await super.sleep(500);

    const [title, price, code, optionElements, imgUrlElements] =
      await Promise.all([
        // 상품명 추출
        this.driver.findElement(By.css('.item_detail_tit h3')).getText(),

        // 가격 추출
        this.driver.findElement(By.css('.item_price strong strong')).getText(),

        // 상품코드 추출
        this.driver
          .findElement(By.css('.item_detail_list dl:nth-child(5) dd'))
          .getText(),

        // 옵션 및 재고 추출
        this.driver.findElements(By.css('.item_add_option_box option')),

        // 이미지 url 추출
        this.driver.findElements(By.css('.detail_explain_box img')),
      ]);

    const options = [];
    const stocks = [];
    for (let i = 1; i < optionElements.length; i++) {
      const optionElement = optionElements[i];
      // 옵션 추출
      const optionText = await this.driver.executeScript(
        'return arguments[0].innerText;',
        optionElement
      );
      options.push(optionText.trim());

      // 재고 추출
      const optionValue = await optionElement.getAttribute('value');
      const match = optionValue.match(/\|\|\|\|(\d+)\^\|/);
      const stock = match ? match[1] : '0';
      stocks.push(stock);
    }

    // 이미지 url 추출
    const imgUrls = [];
    for (let i = 0; i < imgUrlElements.length; i++) {
      const imgUrl = await imgUrlElements[i].getAttribute('src');
      if (imgUrl) {
        imgUrls.push(imgUrl);
      }
    }

    const product = new Product(
      title,
      price,
      code,
      options,
      stocks,
      imgUrls,
      thumbNailUrl
    );
    product.displayInfo();

    this.productList.push(product);
  }
}

module.exports = ManoPaloScraper;
