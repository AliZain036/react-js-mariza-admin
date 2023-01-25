import { EMPTY_INTERESTS, GET_INTERESTS } from "../ActionTypes";

const initialState = {
  interests: [],
  isLoading: true,
};

export const Interests = (state = initialState, action) => {
  switch (action.type) {
    case GET_INTERESTS: {
      return {
        isLoading: false,
        interests: action.payload,
      };
    }
    case EMPTY_INTERESTS: {
      return {
        interests: [],
        isLoading: true,
      };
    }
    default: {
      return state;
    }
  }
};
