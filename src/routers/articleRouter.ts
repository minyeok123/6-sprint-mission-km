import express from 'express';
import { validate } from '../middleware/validate';
import {
  CreateArticle,
  PatchArticle,
  GetArticlesQuery,
  ArticleIdParams,
} from '../structs/articleStruct';
import { CreateArticleComment } from '../structs/commentStruct';
import { tryCatchHandler } from '../middleware/errorhandler';
import { ArticleController } from '../controller/articleController';
import { UploadImage, textParser } from '../middleware/formdataParser';
import { authenticate } from '../middleware/authenticate';
import { commentController } from '../controller/commentController';
const articleRouter = express.Router();

const articleImageUpload = UploadImage('article-image');

// 자유게시판 목록 조회 및 생성
articleRouter
  .route('/')
  .get(validate(GetArticlesQuery, 'query'), tryCatchHandler(ArticleController.getArticles))
  .post(
    authenticate,
    articleImageUpload.array('articleImage', 5),
    validate(CreateArticle),
    tryCatchHandler(ArticleController.createArticle),
  );
// 자유게시판 상세 조회 및 수정 및 삭제
articleRouter
  .route('/:articleId')
  .get(validate(ArticleIdParams, 'params'), tryCatchHandler(ArticleController.getArticleDetail))
  .patch(
    authenticate,
    articleImageUpload.none(),
    validate(ArticleIdParams, 'params'),
    validate(PatchArticle),
    tryCatchHandler(ArticleController.patchArticle),
  )
  .delete(
    authenticate,
    validate(ArticleIdParams, 'params'),
    tryCatchHandler(ArticleController.deleteArticle),
  );

//자유게시판 댓글 생성
articleRouter
  .route('/:articleId/comments')
  .post(
    authenticate,
    textParser,
    validate(ArticleIdParams, 'params'),
    validate(CreateArticleComment),
    tryCatchHandler(commentController.createArticleComment),
  );

export default articleRouter;
