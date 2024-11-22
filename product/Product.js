class Product {
  constructor(name, price, code, options, stocks, imgTags, thumbNailUrl) {
    this.name = name;
    this.price = price;
    this.code = code;
    this.options = options;
    this.stocks = stocks;
    this.imgTags = imgTags;
    this.thumbNailUrl = thumbNailUrl;
  }

  displayInfo() {
    console.log('name:', this.name);
    console.log('price:', this.price);
    console.log('code:', this.code);
    console.log('options:', this.options);
    console.log('stocks:', this.stocks);
    console.log('imgUrls:', this.imgUrls);
    console.log('thumbNailUrl:', this.thumbNailUrl);
  }
}

module.exports = Product;
