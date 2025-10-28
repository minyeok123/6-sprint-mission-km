import express from 'express';
import productRouter from './routers/produictRouter.js';
import { PORT } from '../constants.js';

const app = express();
app.use(express.json());

app.use('/products', productRouter);

app.listen(PORT || 3000, () => console.log('server started'));
