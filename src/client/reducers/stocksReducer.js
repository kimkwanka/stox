const removeByName = (arr, name) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].name === name) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr;
};

const stocks = (state = [], action) => {
  switch (action.type) {
    case 'ADD_STOCK': {
      let newState = state.slice(0);

      newState = removeByName(newState, action.stock.name);
      newState = newState.concat([action.stock]);

      return newState;
    }
    case 'REMOVE_STOCK': {
      let newState = state.slice(0);
      newState = removeByName(newState, action.stockName);
      return newState;
    }
    default:
      return state;
  }
};

export default stocks;
