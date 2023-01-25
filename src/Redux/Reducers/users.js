import { EMPTY_USERS, GET_USERS } from "../ActionTypes";

const initialState = {
  isLoading: true,
  users: [],
};

export const Users = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS: {
      return {
        isLoading: false,
        users: action.payload,
      };
    }
    case EMPTY_USERS: {
      return {
        isLoading: true,
        users: [],
      };
    }
    default: {
      return state;
    }
  }
};
