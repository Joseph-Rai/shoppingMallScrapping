const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class IScraper {
  constructor(id, password) {
    const options = new chrome.Options();
    // options.addArguments('--headless'); // 헤드리스 모드
    options.addArguments('--disable-gpu'); // GPU 비활성화 (Linux 환경에서 권장)
    options.addArguments('--no-sandbox'); // 샌드박스 모드 비활성화 (권장)
    options.addArguments(
      'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
    );

    const driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // 타임아웃 설정
    this.id = id;
    this.password = password;
    this.driver = driver;
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

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms)); // ms 밀리초만큼 대기
  }
}

module.exports = IScraper;
