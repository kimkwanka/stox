import getStockData from './quandl';
import { addStock, removeStock } from '../client/actions/stockActions';
import initServerStore from './serverStore';

const socketIO = (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('REQUEST_ACTION', (action) => {
    switch (action.type) {
      case 'ADD_STOCK': {
        getStockData(action.stockName).then((stock) => {
          initServerStore.then((serverStore) => {
            serverStore.dispatch(addStock(stock));

            socket.emit('ACTION_SUCCESS', addStock(stock));
            socket.broadcast.emit('ACTION_OTHER_CLIENT', addStock(stock));
          });
        })
        .catch((err) => {
          console.log('Error adding', action.stockName);
          socket.emit('ACTION_ERROR', { msg: `ERROR: Couldn't find '${action.stockName}'.` });
        });
        break;
      }
      case 'DELETE_STOCK': {
        initServerStore.then((serverStore) => {
          serverStore.dispatch(removeStock(action.stockName));

          socket.emit('ACTION_SUCCESS', removeStock(action.stockName));
          socket.broadcast.emit('ACTION_OTHER_CLIENT', removeStock(action.stockName));
        });
        break;
      }
      default:
        break;
    }
  });
};

export default socketIO;
