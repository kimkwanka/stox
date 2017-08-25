export function addStock(stock) {
  return {
    type: 'ADD_STOCK',
    stock,
  };
}

export function removeStock(stock) {
  return {
    type: 'REMOVE_STOCK',
    stock,
  };
}
