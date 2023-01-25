import { EMPTY_CATEGORIES, GET_CATEGORIES } from "../ActionTypes";

const initialState = {
  categories: [],
  isLoading: true,
};

export const Categories = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES: {
      return {
        isLoading: false,
        categories: action.payload,
      };
    }
    case EMPTY_CATEGORIES: {
      return {
        categories: [],
        isLoading: true,
      };
    }
    default: {
      return state;
    }
  }
};
