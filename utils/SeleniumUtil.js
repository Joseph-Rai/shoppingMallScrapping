const chrome = require('selenium-webdriver/chrome');
const { Builder } = require('selenium-webdriver');

const initChromeDriver = () => {
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

  return driver;
};

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms)); // ms 밀리초만큼 대기
};

module.exports = { initChromeDriver, sleep };
