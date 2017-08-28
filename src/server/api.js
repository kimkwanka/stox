import getStockData from './quandl';

const api = (app) => {
  app.post('/api', (req, res) => {
    const stockName = req.body.stockName;
    getStockData(stockName)
    .then((stockData) => {
      res.json(stockData);
    });
  });
};

export default api;
