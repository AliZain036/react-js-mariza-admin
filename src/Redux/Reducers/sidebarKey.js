import { EMPTY_KEY, SET_KEY } from "../ActionTypes";

const initialState = "/statistics";

export const Key = (state = initialState, action) => {
  switch (action.type) {
    case SET_KEY: {
      return action.payload;
    }
    case EMPTY_KEY: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
