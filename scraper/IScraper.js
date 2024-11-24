const { initChromeDriver } = require('../utils');

class IScraper {
  constructor(id, password) {
    // 타임아웃 설정
    this.id = id;
    this.password = password;
    this.driver = initChromeDriver();
    this.productList = [];
    this.productUrls = [];
    this.thumbNailUrls = [];
  }

  // 페이지 이동 메서드
  async move(url) {
    await driver.get(url);
  }

  // 상품 리스트 가져오기 메서드
  async getProductList() {
    return this.productList;
  }

  // 드라이버 종료
  async quitDriver() {
    await this.driver.quit();
  }

  // 상품 url 개수
  async getCountProductUrls() {
    return this.productUrls.length;
  }

  // 로그인 메서드 (추상)
  async login() {}

  // 상품 URL 리스트 가져오기 메서드 (추상)
  async parseProductUrlList() {}

  // 상품 파싱 메서드 (추상)
  async parseProduct() {}
}

module.exports = IScraper;
