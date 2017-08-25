const stocks = (state = [
  { name: 'GOOGL', description: 'Google' },
  { name: 'YAHOO', description: 'Yahoo' },
], action) => {
  switch (action.type) {
    case 'ADD_STOCK': {
      let newState = state.slice(0);
      newState = newState.concat([action.stock]);
      return newState;
    }
    case 'REMOVE_STOCK': {
      const newState = state.slice(0);
      for (let i = 0; i < newState.length; i += 1) {
        if (newState[i].name === action.stock.name) {
          newState.splice(i, 1);
          break;
        }
      }
      return newState;
    }
    default:
      return state;
  }
};

export default stocks;
