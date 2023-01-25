import {
  LOGIN,
  LOGOUT,
  EMPTY_CATEGORIES,
  EMPTY_OCCASIONS,
  EMPTY_INTERESTS,
  EMPTY_RECIPIENTS,
  EMPTY_USERS,
  EMPTY_PRODUCTS,
  EMPTY_KEY,
} from "./ActionTypes";

export const userLogin = (id, role) => (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: { id, role },
  });
};

export const userLogout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
  dispatch({
    type: EMPTY_CATEGORIES,
  });
  dispatch({
    type: EMPTY_OCCASIONS,
  });
  dispatch({
    type: EMPTY_INTERESTS,
  });
  dispatch({
    type: EMPTY_RECIPIENTS,
  });
  dispatch({
    type: EMPTY_USERS,
  });
  dispatch({
    type: EMPTY_PRODUCTS,
  });
  dispatch({
    type: EMPTY_KEY,
  });
};
