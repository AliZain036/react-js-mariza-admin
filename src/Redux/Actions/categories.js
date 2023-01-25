import { GET_CATEGORIES } from "../ActionTypes";
import { firebase } from "../../Firebase/config";
import { message } from "antd";

export const fetchCategories = () => async (dispatch) => {
  let arr = [];
  await firebase
    .firestore()
    .collection("categories")
    .get()
    .then((allDocs) => {
      allDocs.forEach((doc) => {
        let obj = doc.data();
        obj.id = doc.id;
        arr.push(obj);
      });
      dispatch({
        type: GET_CATEGORIES,
        payload: arr,
      });
    })
    .catch((e) => console.log(e));
};

export const addCategory = (val) => async (dispatch) => {
  const values = {
    name: val,
  };
  const stats = {
    liked: 0,
    shared: 0,
    saved: 0,
    won: 0,
    clicked: 0,
  };
  values.stats = stats; // setting default values to each product
  await firebase
    .firestore()
    .collection("categories")
    .add(values)
    .then(async () => {
      message.success("Category Created!");
      await dispatch(fetchCategories());
      return 200;
    })
    .catch((error) => {
      console.log(error);
      message.error("Error Creating Category!");
    });
};
