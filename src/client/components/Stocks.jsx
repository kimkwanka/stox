import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Highcharts from 'highcharts/highstock';

import store from '../../shared/store';
import socket from '../socket';

let updateErrorMsg = null;

if (typeof window !== 'undefined') {
  socket.on('connect', () => {
    console.log('Connected to server.');
  });
  socket.on('ACTION_SUCCESS', (action) => {
    store.dispatch(action);
  });
  socket.on('ACTION_OTHER_CLIENT', (action) => {
    store.dispatch(action);
  });
  socket.on('ACTION_ERROR', (error) => {
    updateErrorMsg(error.msg);
  });
}

const handleDeleteClick = stockName => () => {
  socket.emit('REQUEST_ACTION', { type: 'DELETE_STOCK', stockName });
};

const StockCard = ({ stock }) => (
  <div className="bg-greyish margin-vertical-small margin-right padding-vertical-tiny padding-horizontal-small">
    <div className="flex items-center">
      <h3 className="no-margin margin-right-small">{stock.name}</h3>
      <button
        className="no-padding padding-horizontal-tiny c-primary border-none bg-transparent h2"
        onClick={handleDeleteClick(stock.name)}
      >x</button>
    </div>
    <p>{stock.description}</p>
  </div>
);

class Stocks extends React.Component {

  constructor() {
    super();
    this.errorMsg = '';
    this.chart = null;
    this.newStockName = 'YHOO';
    updateErrorMsg = this.updateErrorMsg.bind(this);
  }

  createChart(stocks) {
    if (this.chart !== null) {
      this.chart.destroy();
    }
    if (typeof window !== 'undefined') {
      this.chart = Highcharts.stockChart('chartContainer', {
        rangeSelector: {
          selected: 1,
        },
        series: stocks,
      });
    }
  }

  handleInputChange(e) {
    this.newStockName = (e.target.value);
    if (this.errorMsg !== '') {
      this.errorMsg = '';
      this.forceUpdate();
    }
  }

  handleAddClick() {
    socket.emit('REQUEST_ACTION', { type: 'ADD_STOCK', stockName: this.newStockName });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleAddClick();
    }
  }

  updateErrorMsg(msg) {
    this.errorMsg = msg;
    this.forceUpdate();
  }

  render() {
    const { stocks } = this.props;
    const stockCards = stocks.map(stock => <StockCard stock={stock} key={stock.name} />);
    this.createChart(stocks);
    return (
      <div>
        <h1>Stocks</h1>
        <div id="chartContainer" />
        <div className="flex">
          {stockCards}
        </div>
        <div className="flex items-center">
          <input type="text" defaultValue={this.newStockName} onChange={e => this.handleInputChange(e)} onKeyPress={e => this.handleKeyPress(e)} placeholder="Add stock" />
          <button onClick={() => this.handleAddClick()}>Add</button>
        </div>
        <h4 className="center c-danger">{this.errorMsg}</h4>
      </div>
    );
  }
}


StockCard.propTypes = {
  stock: PropTypes.objectOf(PropTypes.shape).isRequired,
};

Stocks.propTypes = {
  stocks: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default connect(reduxStore => ({
  stocks: reduxStore.stocks,
}))(Stocks);
