const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os'); // os 모듈 추가

class ImageDownloader {
  constructor(savePath = null) {
    // 운영 체제에 맞는 기본 다운로드 폴더 경로 설정
    const defaultDownloadFolder = path.join(
      os.homedir(),
      'Downloads',
      '상품이미지'
    );

    // savePath가 null이면 기본값 사용
    this.savePath = savePath || defaultDownloadFolder;

    // 다운로드 경로가 없는 경우 디렉토리 생성
    if (!fs.existsSync(this.savePath)) {
      fs.mkdirSync(this.savePath, { recursive: true });
    }
  }

  extractFileName(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  async downloadImage(url) {
    const fileName = this.extractFileName(url);
    const outputPath = path.join(this.savePath, fileName);

    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      });

      // 스트림을 파일로 저장
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`이미지 다운로드 완료: ${outputPath}`);
          resolve(outputPath);
        });
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('이미지 다운로드 실패:', error);
      throw error;
    }
  }
}

module.exports = ImageDownloader;
