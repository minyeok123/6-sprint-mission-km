import express from 'express';
import productRouter from './routers/productRouter.js';
import { PORT } from '../constants.js';
import articleRouter from './routers/articleRouter.js';
import commentRouter from './routers/commentRouter.js';
const app = express();
app.use(express.json());

//중고마켓 라우트 핸들러
app.use('/products', productRouter);

//자유게시판 라우트핸들러
app.use('/articles', articleRouter);

//중고마켓 댓글
app.use('/comments', commentRouter);

app.listen(PORT || 3000, () => console.log('server started'));
