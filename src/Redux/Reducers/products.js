import { GET_PRODUCTS, EMPTY_PRODUCTS } from "../ActionTypes";

const initialState = {
  isLoading: true,
  products: [],
};

export const Products = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS: {
      return {
        isLoading: false,
        products: action.payload,
      };
    }
    case EMPTY_PRODUCTS: {
      return {
        isLoading: true,
        products: [],
      };
    }
    default: {
      return state;
    }
  }
};
