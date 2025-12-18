import 'express-async-errors';
import express from 'express';
import productRouter from './routers/productRouter';
import { PORT } from './utils/constants';
import articleRouter from './routers/articleRouter';
import commentRouter from './routers/commentRouter';
import userRouter from './routers/userRouter';
import { errorHandler } from './middleware/errorhandler';
import cors from 'cors';
// import orderRouter from './routers/orderRouter';
import cookieParser from 'cookie-parser';
import authRouter from './routers/authRouter';
import likeRouter from './routers/likeRouter';
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/files', express.static('uploads'));

app.use(cors());

//중고마켓 라우트 핸들러
app.use('/products', productRouter);

//자유게시판 라우트핸들러
app.use('/articles', articleRouter);

//중고마켓 댓글
app.use('/comments', commentRouter);

//이용자 라우트 핸들러
app.use('/users', userRouter);

//주문생성
// app.use('/orders', orderRouter);

//인가 인증
app.use('/auth', authRouter);

//좋아요
app.use('/like', likeRouter);

//전역 에러핸들러
app.use(errorHandler);

app.listen(PORT || 3000, () => console.log('server started'));
