/**
* 댓글 테이블에서 NULL 값을 없애기위해 상품댓글 , 아티클댓글 테이블로 분리
*/

CREATE TABLE ProductComments(
id SERIAL PRIMARY KEY,
content text NOT NULL,
createdAt TIMESTAMPTZ DEFAULT NOW(),
updatedAt TIMESTAMPTZ DEFAULT NOW(),
userId int NOT NULL,
productId int NOT NULL,
FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
FOREIGN KEY (productId) REFERENCES "Product"(id) ON DELETE CASCADE
);


CREATE TABLE ArticleComments(
id SERIAL PRIMARY KEY,
content text NOT NULL,
createdAt TIMESTAMPTZ DEFAULT NOW(),
updatedAt TIMESTAMPTZ DEFAULT NOW(),
userId int NOT NULL,
productId int NOT NULL,
FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
FOREIGN KEY (productId) REFERENCES "Product"(id) ON DELETE CASCADE);


drop table "Comment";

/**
*라이크 테이블에서 상품 라이크, 아티클 라이크 분리
*/
CREATE TABLE "ProductLike"(
id SERIAL PRIMARY KEY,
"createdAt" TIMESTAMPTZ DEFAULT NOW(),
"userId" int NOT NULL,
"productId" int NOT NULL,UNIQUE ("userId","productId"),
FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY ("productId") REFERENCES "Product"(id) ON UPDATE CASCADE ON DELETE CASCADE);

CREATE TABLE "ArticleLike"(
id SERIAL PRIMARY KEY,
"createdAt" TIMESTAMPTZ DEFAULT NOW(),
"userId" int NOT NULL,
"articleId" int NOT NULL,UNIQUE ("userId","articleId"),
FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY ("articleId") REFERENCES "Article"(id) ON UPDATE CASCADE ON DELETE CASCADE);

drop table "Like";

/*
상품 문의 테이블 생성 
*/

CREATE TABLE "ProductInquiry"(
id SERIAL PRIMARY KEY,
content text NOT NULL,
"createdAt" TIMESTAMPTZ DEFAULT NOW(),
"userId" int NOT NULL,
"productId" int NOT NULL,
FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE,
FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE);

/*
상품 테이블에서 태크 칼럼 삭제,
태그 칼럼의 이넘 타입 삭제,
태그 테이블 생성,
상품과 태그의 중간 테이블 생성
*/

ALTER TABLE "Product" DROP COLUMN tag;

DROP TYPE tag;

CREATE TABLE "Tag"(
id SERIAL PRIMARY KEY,
tag text NOT NULL UNIQUE,
"createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "ProductWithTag"(
"productId" INT NOT NULL,
"tagId" INT NOT NULL,
"createdAt" TIMESTAMPTZ DEFAULT NOW(),
"updatedAt" TIMESTAMPTZ DEFAULT NOW(),
PRIMARY KEY("productId" ,"tagId"),
FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE,
FOREIGN KEY ("tagId") REFERENCES "Tag"(id) ON DELETE CASCADE);




