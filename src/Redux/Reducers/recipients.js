import { EMPTY_RECIPIENTS, GET_RECIPIENTS } from "../ActionTypes";

const initialState = {
  recipients: [],
  isLoading: true,
};

export const Recipients = (state = initialState, action) => {
  switch (action.type) {
    case GET_RECIPIENTS: {
      return {
        isLoading: false,
        recipients: action.payload,
      };
    }
    case EMPTY_RECIPIENTS: {
      return {
        recipients: [],
        isLoading: true,
      };
    }
    default: {
      return state;
    }
  }
};
