import { createStore } from 'redux';
import reducers from '../client/reducers';

import getStockData from './quandl';

const initServerStore = new Promise((resolve, reject) => {
  const stockNames = ['GOOGL', 'AAPL']; //  ['GOOGL', 'AAPL', 'YHOO'];
  const results = Promise.all(stockNames.map(stockName => getStockData(stockName)));

  results.then((stocks) => {
    const serverState = { stocks };
    const serverStore = createStore(reducers, serverState);
    console.log('Server store successfully initialized.');
    resolve(serverStore);
  })
  .catch((err) => {
    reject(err);
  });
});

export default initServerStore;
