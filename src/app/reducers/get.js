const reducer = (state = 0, action) => {
  switch (action.type) {
  case 'INIT':
    return action.data;
  case 'ADD':
    return state + action.data;
  default:
    return state;
  }
};

export const initializeGet = () => {
  return {
    type: 'INIT',
    data: 0,
  };
};

export const addGet = () => {
  return {
    type: 'ADD',
    data: 1,
  };
};

export default reducer;