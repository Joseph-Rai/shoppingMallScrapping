const XLSX = require('xlsx'); // xlsx 라이브러리 임포트
const path = require('path'); // path 모듈 추가
const os = require('os'); // os 모듈 추가

class ExcelExporter {
  constructor(savePath = null, fileName = 'products.xlsx') {
    // 운영 체제에 맞는 기본 다운로드 폴더 경로 설정
    const defaultDownloadFolder = path.join(
      os.homedir(),
      'Downloads',
      fileName || 'products.xlsx'
    );

    // savePath가 null이면 기본값 사용
    this.savePath = savePath || defaultDownloadFolder;
  }

  // 저장 경로를 설정하는 set 함수
  setSavePath(path) {
    this.savePath = path;
  }

  // 단일 Product 객체를 Excel로 내보내기
  exportToExcel(product) {
    if (Array.isArray(product)) {
      this._exportToExcelMultiple(product);
    } else {
      this._exportToExcelMultiple([product]);
    }
  }

  // Product 객체 배열을 Excel로 내보내기
  _exportToExcelMultiple(products) {
    const wsData = [];
    for (const product of products) {
      const data = {
        name: product.name,
        price: product.price,
        code: product.code,
        options: product.options.join(', '), // 옵션은 ','로 구분하여 문자열로 저장
        stocks: product.stocks.join(', '), // 재고는 ','로 구분하여 문자열로 저장
        imgUrls: product.imgUrls.join(', '), // 이미지 URL도 ','로 구분하여 문자열로 저장
        thumbNailUrl: product.thumbNailUrl,
      };

      wsData.push(data);
    }

    this._generateExcelFile(wsData);
  }

  // 공통적으로 사용하는 Excel 파일 생성 로직
  _generateExcelFile(wsData) {
    const customHeaders = [
      'ThumbNailUrl',
      'Name',
      'Price',
      'Code',
      'Options',
      'Stocks',
      'Image URLs',
    ];

    // 데이터를 변환하기 전에 헤더를 커스터마이즈된 필드명으로 매핑
    const customWsData = wsData.map((item) => ({
      ThumbNailUrl: item.thumbNailUrl,
      Name: item.name,
      Price: item.price,
      Code: item.code,
      Options: item.options,
      Stocks: item.stocks,
      'Image URLs': item.imgUrls,
    }));

    // 워크시트 생성
    const ws = XLSX.utils.json_to_sheet(customWsData, {
      header: customHeaders,
    });

    // 워크북 생성
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    // Excel 파일로 저장
    XLSX.writeFile(wb, this.savePath);
  }
}

module.exports = ExcelExporter;
