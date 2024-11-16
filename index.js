const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const Product = require('./Product.js');
const ExcelExporter = require('./ExcelExporter.js');

main();

async function main() {
  // 1. 크롬 드라이버 획득
  const driver = await initializeChromeDriver();

  try {
    const id = '';
    const password = '';

    await doLogin(driver, id, password);

    // 상품리스트 페이지로 이동
    const allMenu = await driver.findElement(By.css('.depth0.gnb_menu0'));
    await allMenu.click();
    await driver.wait(until.elementLocated(By.css('.item_linenum4')), 10000);

    // 상품목록 및 url 리스트 추출
    const items = await driver.findElements(By.css('.item_linenum4'));
    const urls = [];
    const thumbNailUrls = [];
    for (const item of items) {
      const url = await item.findElement(By.css('a')).getAttribute('href');
      urls.push(url);

      const thumbNailUrl = await item
        .findElement(By.css('a img'))
        .getAttribute('src');

      thumbNailUrls.push(thumbNailUrl);
    }

    // url 순회하며 product 추출
    const products = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const thumbNailUrl = thumbNailUrls[i];
      const product = await parseProduct(driver, url, thumbNailUrl);
      products.push(product);
    }

    // 기본 저장경로는 다운로드 폴더
    const exporter = new ExcelExporter();
    exporter.exportToExcel(products);
  } finally {
    // 6. 브라우저 종료
    await driver.quit();
  }

  console.log('작업이 완료 되었습니다.');
}

// ---------------------------- 함수 정의부분 ----------------------------------
async function doLogin(driver, id, password) {
  const loginPage = 'http://b2bsarlim.com/member/login.php';

  // 웹페이지 열기
  await driver.get(loginPage);

  // 요소 찾기 및 상호작용
  const txtId = await driver.findElement(By.css('#loginId'));
  const txtPassword = await driver.findElement(By.css('#loginPwd'));
  const btnLogin = await driver.findElement(
    By.className('member_login_order_btn')
  );

  // 로그인 시도
  await txtId.sendKeys(id);
  await txtPassword.sendKeys(password);
  await btnLogin.click();

  // 로그인 완료될 때까지 대기
  await sleep(3000);
}

async function parseProduct(driver, url, thumbNailUrl) {
  await driver.get(url);
  await sleep(500);

  const [title, price, code, optionElements, imgUrlElements] =
    await Promise.all([
      // 상품명 추출
      driver.findElement(By.css('.item_detail_tit h3')).getText(),

      // 가격 추출
      driver.findElement(By.css('.item_price strong strong')).getText(),

      // 상품코드 추출
      driver
        .findElement(By.css('.item_detail_list dl:nth-child(5) dd'))
        .getText(),

      // 옵션 및 재고 추출
      driver.findElements(By.css('.item_add_option_box option')),

      // 이미지 url 추출
      driver.findElements(By.css('.detail_explain_box img')),
    ]);

  const options = [];
  const stocks = [];
  for (let i = 1; i < optionElements.length; i++) {
    const optionElement = optionElements[i];
    // 옵션 추출
    const optionText = await driver.executeScript(
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

  return product;
}

async function initializeChromeDriver() {
  const options = new chrome.Options();
  // options.addArguments('--headless'); // 헤드리스 모드
  options.addArguments('--disable-gpu'); // GPU 비활성화 (Linux 환경에서 권장)
  options.addArguments('--no-sandbox'); // 샌드박스 모드 비활성화 (권장)
  options.addArguments(
    'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
  );

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  // 타임아웃 설정
  driver.manage().setTimeouts({ implicit: 5000 });
  return driver;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms)); // ms 밀리초만큼 대기
}
