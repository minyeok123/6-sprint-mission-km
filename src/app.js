import express from 'express';
import productRouter from './routers/produictRouter.js';
import { PORT } from '../constants.js';
import articleRouter from './routers/articleRouter.js';
const app = express();
app.use(express.json());

//프로덕트 라우트 핸들러
app.use('/products', productRouter);

app.use('/articles', articleRouter);

app.listen(PORT || 3000, () => console.log('server started'));
