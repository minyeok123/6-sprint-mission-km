import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./ProductService.js";
import { PRODUCT, ElectronicProduct } from "./ProductClass.js";
import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ArticleService.js";
import { ARTICLE } from "./ArticleClass.js";

function addArtget() {
  let thing;
  thing = new ARTICLE(arti.title, arti.content);

  return thing;
}

//실행 ====================================================================

const NewProductData = {
  name: "RTX9080",
  description: "Graphic Card",
  price: 600000000,
  tags: ["전자제품", "그래픽카드"],
  images: ["https://example.com/..."],
};

const PatchProductData = {
  name: "RTX9080",
  description: "Graphic Card, 100만원 특가 할인",
  price: 500000000,
  tags: ["전자제품", "그래픽카드"],
  images: ["https://example.com/..."],
};

// const ProductList = await getProductList(1, 10);
// console.log(ProductList); //상품 리스트 출력

// const ProductSearch = await getProduct(2544);
// console.log(ProductSearch); //상품 조회

// const CreateProduct = await createProduct(NewProductData);
// console.log(CreateProduct); //상품 생성

// const PatchProduct = await patchProduct(2544, PatchProductData);
// console.log(PatchProduct); //제품 정보 변경

// const DeleteProduct = await deleteProduct(2544);
// console.log(DeleteProduct); //제품 정보 삭제

//리스트 팩토리 실행================================================================
const arr = []; //ProductList 팩토리
function addList() {
  for (let i = 0; i < List.list.length; i++) {
    let exp = List.list[i];
    let thing;
    if (!exp.tags.includes("전자제품"))
      thing = new PRODUCT(
        exp.name,
        exp.description,
        exp.price,
        exp.tags,
        exp.images
      );
    if (exp.tags.includes("전자제품"))
      thing = new ElectronicProduct(
        exp.name,
        exp.description,
        exp.price,
        exp.tags,
        exp.images
      );

    arr.push(thing);
  }
}
const product = arr;

// const List = await getProductList(1, 10);
// addList(); //팩토리 스위치
// product[0].favorite(); //찜꽁
// product[0].favorite();
// product[0].favorite();
// product[0].favorite();
// product[0].favorite();

// product[4].favorite();
// product[4].favorite();
// product[4].favorite();

// product[2].favorite(); //찜꽁
// product[2].favorite();
// product[2].favorite();
// product[2].favorite();
// product[2].favorite();

// product[8].favorite();
// product[8].favorite();
// product[8].favorite();

// console.log(product);

//================================Article==================================
const NewArticleData = {
  image: "https://example.com/...",
  content: "큰 물고기를 잡았는데,집가면서 상어한테 다 뜯김",
  title: "노인과 바다 ",
};

const PatchArticleData = {
  image: "https://example.com/...",
  content:
    "큰 물고기를 잡았는데,집가면서 상어한테 다 뜯김, 항구에 도착했을 땐 청새치 뼈대만 남아 있었음",
  title: "노인과 바다 ",
};
// const ArticleList = await getArticleList(1, 10);
// console.log(ArticleList); //리스트 조회

// const Article = await getArticle(5008);
// console.log(Article); //작품 조회

// const CreateArticle = await createArticle(NewArticleData);
// console.log(CreateArticle); //새로운 작품 생성

// const PatchArticle = await patchArticle(5014, PatchArticleData);
// console.log(PatchArticle); //작품 변경

// const DeleteArticle = await deleteArticle(4719);
// console.log(DeleteArticle); //작품 삭제(오류 발생 설정)

// //     ---------------------------------------------------------------------------------
// const arti = await getArticle(4749);
// const SearchArticle = addArtget();
// console.log(SearchArticle);

//리스트 팩토리 실행----------------------------------------------------------------------
const art = []; //ArticleList 팩토리
function addArtList() {
  for (let i = 0; i < ArtList.list.length; i++) {
    let exp = ArtList.list[i];
    let thing;
    thing = new ARTICLE(exp.title, exp.content);

    art.push(thing);
  }
}
const article = art;

const ArtList = await getArticleList(1, 10);
addArtList(); //팩토리 스위치
article[0].like(); // 좋아요
article[0].like();
article[0].like();
article[3].like();
article[3].like();
article[3].like();
article[4].like();
article[4].like();
article[4].like();
article[4].like();
console.log(article);
// // console.table(article);
