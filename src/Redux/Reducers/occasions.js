import { EMPTY_OCCASIONS, GET_OCCASIONS } from "../ActionTypes";

const initialState = {
  occasions: [],
  isLoading: true,
};

export const Occasions = (state = initialState, action) => {
  switch (action.type) {
    case GET_OCCASIONS: {
      return {
        isLoading: false,
        occasions: action.payload,
      };
    }
    case EMPTY_OCCASIONS: {
      return {
        occasions: [],
        isLoading: true,
      };
    }
    default: {
      return state;
    }
  }
};
