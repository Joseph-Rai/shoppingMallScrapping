const ExcelExporter = require('./ExcelExporter.js');
const ManoPaloScraper = require('./scraper/ManoPaloScraper.js');

main();

async function main() {
  const id = '';
  const password = '';

  // 만오팔오 스크래퍼 클래스 초기화
  const manoPaloScraper = new ManoPaloScraper(id, password);

  try {
    // 로그인 시도
    await manoPaloScraper.login();
    await manoPaloScraper.parseProductUrlList();

    // url 순회하며 product 추출
    for (let i = 0; i < (await manoPaloScraper.getCountProductUrls()); i++) {
      await manoPaloScraper.parseProduct(i);
    }

    // 기본 저장경로는 다운로드 폴더
    const exporter = new ExcelExporter();
    const products = await manoPaloScraper.getProductList();
    exporter.exportToExcel(products);
    await exporter.downloadThumbNailImagesAll(products);
  } finally {
    // 6. 브라우저 종료
    manoPaloScraper.quitDriver();
  }

  console.log('작업이 완료 되었습니다.');
}
