# 판다마켓 API 명세

## 1. Auth (인증/유저)

- **POST** `/auth/register` - 회원가입
- **POST** `/auth/login` - 로그인
- **POST** `/auth/refresh` - 토큰 재발급
- **POST** `/auth/logout` - 로그아웃
- **GET** `/auth/:userId` - 유저 정보 조회
- **PATCH** `/auth/:userId/update-info` - 유저 정보 수정 (닉네임, 프로필 이미지 등)
- **PATCH** `/auth/:userId/password` - 비밀번호 변경
- **DELETE** `/auth/:userId/delete-account` - 회원 탈퇴

## 2. Products (중고 상품)

- **GET** `/products` - 상품 목록 조회 (검색, 정렬, 페이지네이션)
- **POST** `/products` - 상품 등록
- **GET** `/products/:productId` - 상품 상세 조회
- **PATCH** `/products/:productId` - 상품 정보 수정
- **DELETE** `/products/:productId` - 상품 삭제
- **GET** `/products/users/:userId/created-products` - 유저가 등록한 상품 목록
- **GET** `/products/users/:userId/liked-products` - 유저가 좋아요한 상품 목록

## 3. Articles (자유 게시판)

- **GET** `/articles` - 게시글 목록 조회
- **POST** `/articles` - 게시글 등록
- **GET** `/articles/:articleId` - 게시글 상세 조회
- **PATCH** `/articles/:articleId` - 게시글 수정
- **DELETE** `/articles/:articleId` - 게시글 삭제
- **GET** `/articles/users/:userId/created-articles` - 유저가 작성한 게시글 목록
- **GET** `/articles/users/:userId/liked-articles` - 유저가 좋아요한 게시글 목록

## 4. Comments (댓글)

- **POST** `/comments/:productId/product-comments` - 상품 댓글 작성
- **POST** `/comments/:articleId/article-comments` - 게시글 댓글 작성
- **GET** `/comments/product-comments` - 상품 댓글 목록 조회
- **GET** `/comments/article-comments` - 게시글 댓글 목록 조회
- **PATCH** `/comments/product-comments/:commentId` - 상품 댓글 수정
- **PATCH** `/comments/article-comments/:commentId` - 게시글 댓글 수정
- **DELETE** `/comments/product-comments/:commentId` - 상품 댓글 삭제
- **DELETE** `/comments/article-comments/:commentId` - 게시글 댓글 삭제

## 5. Likes (좋아요)

- **POST** `/like/:productId/productLike` - 상품 좋아요 토글
- **POST** `/like/:articleId/articleLike` - 게시글 좋아요 토글

## 6. Files (파일 업로드)

- **POST** `/files/upload?folder={folderName}` - 이미지 업로드 (folder: products, articles, profiles)
