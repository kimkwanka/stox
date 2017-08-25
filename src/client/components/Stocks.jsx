import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import Highcharts from 'highcharts/highstock';

const getStockData = (stockName, callback) => {
  const start = new Date(new Date().getTime() - (2 * 86400 * 1000));
  start.setFullYear(start.getFullYear() - 1);
  const end = new Date(new Date().getTime());

  const startDateStr = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
  const endDateStr = `${end.getFullYear()}-${end.getMonth()}-${end.getDate()}`;

  axios.get(`https://www.quandl.com/api/v3/datasets/WIKI/${stockName}/data.json?order=asc&column_index=4&start_date=${startDateStr}&end_date=${endDateStr}&api_key=2VY7hA7ReAi-dk1y-UWY`)
  .then((res) => {
    const stockData = res.data.dataset_data.data.map(
      d => ([new Date(d[0]).getTime(), d[1]]),
    );
    callback({
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
};

const getAllStockData = (stocks, callback) => {
  const stocksToRetrieve = stocks.slice(0);
  const series = [];
  stocksToRetrieve.forEach(
    (stockName) => {
      getStockData(stockName, (stockSeries) => {
        series.push(stockSeries);
        if (series.length === stocksToRetrieve.length) {
          callback(series);
        }
      });
    },
  );
};

const createChart = () => {
  if (typeof window !== 'undefined') {
    return Highcharts.stockChart('chartContainer', {
      rangeSelector: {
        selected: 1,
      },
      title: {
        text: 'Stocks',
      },
      series: [],
    });
  }
  return null;
};

const StocksContainer = Component => (
  class extends React.Component {
    constructor() {
      super();
      this.stocks = ['GOOGL', 'AAPL', 'YHOO'];
      this.series = [];
      this.newSeries = '';
    }
    componentDidMount() {
      this.chart = createChart();
      this.chart.showLoading();
      getAllStockData(this.stocks, (series) => {
        this.series = series;
        this.series.forEach((serie) => {
          this.chart.addSeries(serie);
        });
        this.chart.hideLoading();
        this.forceUpdate();
      });
    }
    componentWillUnmount() {
      if (this.chart) {
        this.chart.destroy();
      }
    }
    onChange(e) {
      this.newSeries = e.target.value;
      console.log(this.newSeries);
    }
    addStockClick() {
      this.stocks.push(this.newSeries);
      getStockData(this.newSeries, (series) => {
        this.chart.addSeries(series);
        this.forceUpdate();
        console.log('Adding stock:', this.stocks);
      });
    }
    render() {
      return (
        <Component
          onAddStockClick={() => this.addStockClick()}
          onChange={e => this.onChange(e)} inputVal={this.newSeries}
        />
      );
    }
  }
);

const Stocks = ({ onAddStockClick, onChange, inputVal }) => (
  <div>
    <h1>Stocks</h1>
    <div id="chartContainer" />
    <div className="inputButtonDiv">
      <input type="text" defaultValue={inputVal} onChange={onChange} />
      <button onClick={onAddStockClick}>Add</button>
    </div>
  </div>
);

Stocks.propTypes = {
  onAddStockClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  inputVal: PropTypes.string.isRequired,
};


export default StocksContainer(Stocks);
