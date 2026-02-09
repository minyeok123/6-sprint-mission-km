export class PRODUCT {
  constructor(name, description, price, tags, images) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.찜꽁 = "💖x 0"; //찜꽁
  }
  favorite() {
    console.log(`${this.name}을(를) 찜 하였습니다.💖`);

    let num = Number(this.찜꽁[3]);
    num += 1;
    this.찜꽁 = this.찜꽁.slice(0, 3) + num;
  }
}

const Manufacturer = ["IG", "SamsSong", "P.APPLE", "Soni", "Phylaps"];

export class ElectronicProduct extends PRODUCT {
  constructor(name, description, price, tags, images, 찜꽁) {
    super(name, description, price, tags, images, 찜꽁);
    this.manufacturer = Manufacturer[Math.floor(Math.random() * 5)]; //'Math.floor(Math.random() * 5)' <= mdn 참고
  }
}
