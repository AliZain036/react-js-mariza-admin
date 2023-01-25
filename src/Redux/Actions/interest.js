import { GET_INTERESTS } from "../ActionTypes";
import { firebase } from "../../Firebase/config";
import { message } from "antd";

export const fetchInterests = () => async (dispatch) => {
  let arr = [];
  await firebase
    .firestore()
    .collection("interests")
    .get()
    .then((allDocs) => {
      allDocs.forEach((doc) => {
        let obj = doc.data();
        obj.id = doc.id;
        arr.push(obj);
      });
      dispatch({
        type: GET_INTERESTS,
        payload: arr,
      });
    })
    .catch((e) => console.log(e));
};

export const addInterest = (val) => async (dispatch) => {
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
    .collection("interests")
    .add(values)
    .then(async () => {
      message.success("Interest Created!");
      await dispatch(fetchInterests());
      return 200;
    })
    .catch((error) => {
      console.log(error);
      message.error("Error Creating Interest!");
    });
};
