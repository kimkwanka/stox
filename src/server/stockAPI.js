import axios from 'axios';
import dotenv from 'dotenv';

const stockAPI = (app) => {
  dotenv.load();
  const apiKey = process.env.QUANDL_API_KEY;
  app.post('/api', (req, res) => {
    const stockName = req.body.stockName;
    const start = new Date(new Date().getTime() - (2 * 86400 * 1000));
    start.setFullYear(start.getFullYear() - 1);
    const end = new Date(new Date().getTime());

    const startDateStr = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
    const endDateStr = `${end.getFullYear()}-${end.getMonth()}-${end.getDate()}`;

    axios.get(`https://www.quandl.com/api/v3/datasets/WIKI/${stockName}/data.json?order=asc&column_index=4&start_date=${startDateStr}&end_date=${endDateStr}&api_key=${apiKey}`)
    .then((apiRes) => {
      const stockData = apiRes.data.dataset_data.data.map(
        d => ([new Date(d[0]).getTime(), d[1]]),
      );
      res.json({
        name: stockName,
        tooltip: {
          valueDecimals: 2,
        },
        data: stockData,
      });
    })
    .catch((err) => {
      console.log('ERR:', err);
    });
  });
};

export default stockAPI;
