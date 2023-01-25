import { GET_PRODUCTS } from '../ActionTypes'
import { firebase } from '../../Firebase/config'

export const fetchProducts = () => async (dispatch) => {
  let products = []
  await firebase
    .firestore()
    .collection('products')
    .get()
    .then((allProducts) => {
      allProducts.forEach((item) => {
        let obj = item.data()
        obj.id = item.id
        products.push(obj)
      })
    })
  dispatch({
    type: GET_PRODUCTS,
    payload: products,
  })
}
export const updateProduct = async function (id, data) {
  //   console.log("Edit data:", data);
  await firebase
    .firestore()
    .collection('products')
    .doc(id)
    .set(data, { merge: true })
}
