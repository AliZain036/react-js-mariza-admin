import { GET_USERS } from "../ActionTypes";
import { firebase } from "../../Firebase/config";
import { message } from "antd";

const getWishlistByID = async (id) => {
  try {
    const obj = await firebase
      .firestore()
      .collection("wishlists")
      .doc(id)
      .get();
    return obj.data();
  } catch (error) {
    console.log(error);
  }
};

export const fetchUsers = () => async (dispatch) => {
  let usersArray = [];
  await firebase
    .firestore()
    .collection("users")
    .get()
    .then((users) => {
      users.forEach((user) => {
        let obj = user.data();
        obj.id = user.id;
        usersArray.push(obj);
      });
    });
  for (let i = 0; i < usersArray.length; i++) {
    let arr = [];
    for (let j = 0; j < usersArray[i]?.wishlist?.length; j++) {
      const id = usersArray[i].wishlist[j];
      let wishList = await getWishlistByID(id);
      arr.push(wishList);
    }
    usersArray[i].wishlist = {
      public: arr.filter((item) => !item.isPrivate),
      private: arr.filter((item) => item.isPrivate),
    };
  }
  dispatch({
    type: GET_USERS,
    payload: usersArray,
  });
};

/**
 * @description edit wish list of the user
 * @param {array} wishlist array
 * @param {string} type private / public
 * @param {string} userID  id of user
 */
export const updateWishList = (wishlist, type, userID) => async (dispatch) => {
  if (type === "public") {
    await firebase
      .firestore()
      .collection("users")
      .doc(userID)
      .set(
        {
          wishlist: {
            public: wishlist,
          },
        },
        { merge: true }
      )
      .then(() => {
        message.success("Wishlist item deleted!");
      });
  }
  if (type === "private") {
    await firebase
      .firestore()
      .collection("users")
      .doc(userID)
      .set(
        {
          wishlist: {
            private: wishlist,
          },
        },
        { merge: true }
      )
      .then(() => {
        message.success("Wishlist item deleted!");
      });
  }
};
