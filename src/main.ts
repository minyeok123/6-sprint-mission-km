import app from './app';
import { createServer } from 'node:http';
import { initSocket } from './socket';
import { PORT } from './utils/constants';

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(Number(PORT) || 3000, '0.0.0.0', () => console.log('server started'));
