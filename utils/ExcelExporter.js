const XLSX = require('xlsx'); // xlsx 라이브러리 임포트
const path = require('path'); // path 모듈 추가
const os = require('os'); // os 모듈 추가
const fs = require('fs');
const accounting = require('accounting');

class ExcelExporter {
  constructor(savePath = null, fileName = 'products.xlsx') {
    // 운영 체제에 맞는 기본 다운로드 폴더 경로 설정
    const defaultDownloadFolder = path.join(
      os.homedir(),
      'Downloads',
      fileName
    );

    // savePath가 null이면 기본값 사용
    this.savePath = savePath
      ? path.join(savePath, fileName)
      : defaultDownloadFolder;
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
        options: product.options.join('|'),
        imgTags: product.imgTags.join('\n'),
        thumbNailUrl: product.thumbNailUrl,
      };

      wsData.push(data);
    }

    // Excel 파일 생성
    this._generateExcelFile(wsData);
  }

  // 공통적으로 사용하는 Excel 파일 생성 로직
  _generateExcelFile(wsData) {
    const customHeaders = [
      '자체코드',
      '상품명',
      '옵션명',
      '공급가',
      '추가비용',
      '고정판매가',
      '키워드',
      '과세여부',
      '원산지',
      '제조사',
      '목록이미지1',
      '목록이미지2',
      '목록이미지3',
      '목록이미지4',
      '목록이미지5',
      '목록이미지6',
      '목록이미지7',
      '상세설명',
      '마이카테',
      'EMP카테',
      '이셀러스카테',
      '옥션카테',
      'G마켓카테',
      '인터파크카테',
      '네이버카테',
      '11번가카테',
      '고도몰카테',
      '쿠팡카테',
      '위메프카테',
      '티몬카테',
      '롯데온카테',
      '멸치카테',
      '톡스토어카테',
      'SSG카테',
      '성인제품여부',
      '자체거래처코드',
      '카페24카테',
      '올웨이즈카테',
      '올웨이즈링크',
    ];

    // 데이터를 변환하기 전에 헤더를 커스터마이즈된 필드명으로 매핑
    const customWsData = wsData.map((item) => ({
      자체코드: item.code,
      상품명: item.name,
      옵션명: item.options,
      공급가: accounting.unformat(item.price),
      상세설명: item.imgTags,
      원산지: '상세페이지',
      제조사: '협력사',
      자체거래처코드: 'mo85',
    }));

    // 워크시트 생성
    const ws = XLSX.utils.json_to_sheet(customWsData, {
      header: customHeaders,
    });

    // 워크북 생성
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    const uniqueFilePath = this.getUniqueFileName(this.savePath);

    // Excel 파일로 저장
    XLSX.writeFile(wb, uniqueFilePath);
  }

  getUniqueFileName(filePath) {
    let uniqueFilePath = filePath;
    let counter = 1;

    // 파일이 이미 존재하면 순번을 붙인 파일명 생성
    while (fs.existsSync(uniqueFilePath)) {
      const ext = path.extname(filePath);
      const baseName = path.basename(filePath, ext);
      const dir = path.dirname(filePath);

      uniqueFilePath = path.join(dir, `${baseName} (${counter})${ext}`);
      counter += 1;
    }

    return uniqueFilePath;
  }
}

module.exports = ExcelExporter;
