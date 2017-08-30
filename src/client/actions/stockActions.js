export function addStock(stock) {
  return {
    type: 'ADD_STOCK',
    stock,
  };
}

export function removeStock(stockName) {
  return {
    type: 'REMOVE_STOCK',
    stockName,
  };
}
