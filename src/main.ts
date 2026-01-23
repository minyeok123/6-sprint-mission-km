import app from './app'
import { createServer } from 'node:http';
import { initSocket } from './socket';
import { PORT } from './utils/constants';


const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT || 3000, () => console.log('server started'));