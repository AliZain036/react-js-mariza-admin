import { SET_KEY } from "../ActionTypes";

export const setSidebarKey = (value) => (dispatch) => {
  dispatch({
    type: SET_KEY,
    payload: value,
  });
};
