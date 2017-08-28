import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import axios from 'axios';
import Highcharts from 'highcharts/highstock';

import actions from '../actions';

const { addStock, removeStock } = actions;

const getStockData = (stockName, callback) => {
  axios.post('/api', { stockName })
  .then((res) => {
    callback(res.data);
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
      // addStock({ name: stockName, description: 'Test' });
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
          {...this.props}
        />
      );
    }
  }
);

const handleDeleteClick = stock => () => {
  console.log(stock.name);
  removeStock(stock);
};

const StockCard = ({ stock }) => (
  <div className="bg-greyish margin-vertical-small margin-right padding-vertical-tiny padding-horizontal-small">
    <div className="flex items-center">
      <h3 className="no-margin margin-right-small">{stock.name}</h3>
      <button
        className="no-padding padding-horizontal-tiny c-primary border-none bg-transparent h2"
        onClick={handleDeleteClick(stock)}
      >x</button>
    </div>
    <p>{stock.description}</p>
  </div>
);

const Stocks = ({ stocks, onAddStockClick, onChange, inputVal }) => {
  const stockCards = stocks.map(stock => <StockCard stock={stock} key={stock.name} />);
  return (
    <div>
      <h1>Stocks</h1>
      <div id="chartContainer" />
      <div className="flex">
        {stockCards}
      </div>
      <div className="flex items-center">
        <input type="text" defaultValue={inputVal} onChange={onChange} placeholder="Add stock" />
        <button onClick={onAddStockClick}>Add</button>
      </div>
    </div>
  );
};

Stocks.propTypes = {
  onAddStockClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  inputVal: PropTypes.string.isRequired,
  stocks: PropTypes.arrayOf(PropTypes.shape),
};


export default connect(store => ({
  stocks: store.stocks,
}))(StocksContainer(Stocks));
