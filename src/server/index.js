import http from 'http';
import app from './server';
import socketIO from './socket';

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const io = require('socket.io')(server);

let currentApp = app;
let currentSocketIO = socketIO;

server.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Express server running at ${PORT} in ${process.env.NODE_ENV || 'dev'} mode`);
});

io.on('connection', socketIO);

if ((process.env.NODE_ENV !== 'production') && module.hot) {
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
  module.hot.accept('./socket', () => {
    io.removeListener('connection', currentSocketIO);
    io.on('connection', socketIO);
    currentSocketIO = socketIO;
  });
}
